import { NextResponse } from "next/server";
import { Team } from "@/models/Team";
import { Waitlist } from "@/models/WaitlistTeam";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {

    await connectToDatabase();
    
    const registeredTeamsCount = await Team.countDocuments();
    const waitlistedTeamsCount = await Waitlist.countDocuments();
    
    const teams = await Team.find();
    const waitlistedTeams = await Waitlist.find();
    
    const registeredMembersCount = teams.reduce((sum, team) => sum + team.teamSize, 0);
    const waitlistedMembersCount = waitlistedTeams.reduce((sum, team) => sum + team.teamSize, 0);
    
    const recentTeams = await Team.find().sort({ _id: -1 }).limit(5);
    const recentWaitlist = await Waitlist.find().sort({ registeredAt: -1 }).limit(5);

    return NextResponse.json({
      registeredTeams: {
        count: registeredTeamsCount,
        membersCount: registeredMembersCount,
        recent: recentTeams
      },
      waitlistedTeams: {
        count: waitlistedTeamsCount,
        membersCount: waitlistedMembersCount,
        recent: recentWaitlist
      },
      totalTeams: registeredTeamsCount + waitlistedTeamsCount,
      totalMembers: registeredMembersCount + waitlistedMembersCount
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
