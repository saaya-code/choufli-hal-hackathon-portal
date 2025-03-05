/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Team } from "@/models/Team";
import { Submission } from "@/models/Submission";
import { CheckIn } from "@/models/CheckIn";

export async function GET() {
  try {
    await connectToDatabase();

    const submissions = await Submission.find().lean();

    const teamIds = submissions.map(sub => sub.teamId);

    const teams = await Team.find({
      _id: { $in: teamIds }
    });

    const checkIns = await CheckIn.find({
      teamId: { $in: teamIds }
    });

    const teamsWithCheckIn = teams.map(team => {
      const checkIn = checkIns.find(c => 
        c.teamId.toString() === team._id.toString()
      );
      
      return {
        teamId: team._id,
        teamName: team.teamName,
        teamSize: team.teamSize,
        teamMembers: team.teamMembers,
        isCheckedIn: checkIn?.isTeamCheckedIn || false,
        checkedInAt: checkIn?.checkedInAt || null,
        members: checkIn?.members || team.teamMembers.map((member: any) => ({
          memberId: member._id,
          memberName: member.name,
          memberEmail: member.email,
          checkedIn: false
        }))
      };
    });

    return NextResponse.json({ teams: teamsWithCheckIn }, { status: 200 });
  } catch (error) {
    console.error("Error fetching check-in data:", error);
    return NextResponse.json(
      { error: "Failed to fetch check-in data" },
      { status: 500 }
    );
  }
}

// Update check-in status for a team or member
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { teamId, memberId, checkedIn } = data;

    if (!teamId) {
      return NextResponse.json({ error: "Team ID is required" }, { status: 400 });
    }

    await connectToDatabase();

    // Find team to get information
    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Check if check-in record exists
    let checkInRecord = await CheckIn.findOne({ teamId });

    if (!checkInRecord) {
      // Create a new check-in record
      checkInRecord = new CheckIn({
        teamId,
        teamName: team.teamName,
        isTeamCheckedIn: false,
        members: team.teamMembers.map((member: any) => ({
          memberId: member._id,
          memberName: member.name,
          memberEmail: member.email,
          checkedIn: false
        }))
      });
    }

    if (memberId === undefined) {
      checkInRecord.isTeamCheckedIn = checkedIn;
      if (checkedIn) {
        checkInRecord.checkedInAt = new Date();
      } else {
        checkInRecord.checkedInAt = undefined;
      }
    } 
    else {
      const memberIndex = checkInRecord.members.findIndex(
        (m: any) => m.memberId.toString() === memberId.toString()
      );

      if (memberIndex >= 0) {
        checkInRecord.members[memberIndex].checkedIn = checkedIn;
        if (checkedIn) {
          checkInRecord.members[memberIndex].checkedInAt = new Date();
        } else {
          checkInRecord.members[memberIndex].checkedInAt = undefined;
        }
      }
    }

    await checkInRecord.save();

    return NextResponse.json({ 
      success: true, 
      checkIn: checkInRecord 
    }, { status: 200 });
  } catch (error) {
    console.error("Error updating check-in status:", error);
    return NextResponse.json(
      { error: "Failed to update check-in status" },
      { status: 500 }
    );
  }
}
