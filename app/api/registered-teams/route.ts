import { connectToDatabase } from "@/lib/mongodb";
import { Team } from "@/models/Team";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();
  const numberOfTeams = await Team.countDocuments({});
  return NextResponse.json({count: numberOfTeams});
}