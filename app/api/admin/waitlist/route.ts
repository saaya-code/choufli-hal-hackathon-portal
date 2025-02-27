import { NextResponse } from "next/server";
import { Waitlist } from "@/models/WaitlistTeam";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectToDatabase();
    
    const waitlistedTeams = await Waitlist.find({}).sort({ registeredAt: -1 }); // Most recent first
    
    const totalWaitlistMembers = waitlistedTeams.reduce(
      (sum, team) => sum + team.teamSize, 
      0
    );

    return NextResponse.json({ 
      waitlistedTeams, 
      totalWaitlistedTeams: waitlistedTeams.length,
      totalWaitlistMembers 
    });
  } catch (error) {
    console.error("Error fetching waitlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch waitlist" },
      { status: 500 }
    );
  }
}
