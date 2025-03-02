import { connectToDatabase } from '@/lib/mongodb';
import { Team } from '@/models/Team';
import { Submission } from '@/models/Submission';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const teamId = params.id;
    
    if (!teamId) {
      return NextResponse.json(
        { error: 'Team ID is required' }, 
        { status: 400 }
      );
    }
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
        return NextResponse.json(
            { error: 'Invalid team ID' }, 
            { status: 400 }
        );
    }
    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' }, 
        { status: 404 }
      );
    }

    const submission = await Submission.findOne({ teamId });

    return NextResponse.json({
      team: {
        id: team._id,
        name: team.teamName,
        size: team.teamSize,
      },
      submission: submission ? {
        id: submission._id,
        githubUrl: submission.githubUrl,
        deployedUrl: submission.deployedUrl,
        presentationUrl: submission.presentationUrl,
        fileName: submission.fileName,
        submittedAt: submission.submittedAt
      } : null
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team data' }, 
      { status: 500 }
    );
  }
}
