import { connectToDatabase } from "@/lib/mongodb";
import { Team } from "@/models/Team";
import { Waitlist } from "@/models/WaitlistTeam";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();
  const numberOfTeams = await Team.countDocuments({});
  const numberOfWaitlistedTeams = await Waitlist.countDocuments({});
  return NextResponse.json({count: numberOfTeams, inWaitlist: numberOfWaitlistedTeams});
}