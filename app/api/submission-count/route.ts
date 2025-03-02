import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Submission } from '@/models/Submission';

export async function GET() {
  try {
    await connectToDatabase();
    
    const submissionsCount = await Submission.countDocuments();
    
    return NextResponse.json({
      count: submissionsCount
    });
  } catch (error) {
    console.error('Failed to fetch submission count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submission count', count: 0 },
      { status: 200 }
    );
  }
}
