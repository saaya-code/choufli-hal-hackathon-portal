import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Submission } from '@/models/Submission';
import { Team } from '@/models/Team';

export async function GET() {
  try {    
    await connectToDatabase();
    
    const submissions = await Submission.find().sort({ submittedAt: -1 }).lean();
    const submissionsCount = await Submission.countDocuments();
    
    const enrichedSubmissions = await Promise.all(submissions.map(async (submission) => {
      const team = await Team.findById(submission.teamId).lean();
      return {
        ...submission,
        teamName: team?.teamName || 'Unknown Team',
        teamSize: team?.teamSize || 0
      };
    }));
    
    return NextResponse.json({
      submissions: enrichedSubmissions,
        submissionsCount
    });
  } catch (error) {
    console.error('Failed to fetch submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}
