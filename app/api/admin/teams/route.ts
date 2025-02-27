import { NextResponse } from "next/server";
import { Team } from "@/models/Team";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectToDatabase();
    
    const teams = await Team.find({}).sort({ _id: -1 });
    
    const totalMembers = teams.reduce((sum, team) => sum + team.teamSize, 0);

    return NextResponse.json({ 
      teams, 
      totalTeams: teams.length,
      totalMembers 
    });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}
