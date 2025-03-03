import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Settings } from '@/models/Settings';

export async function GET() {
  try {
    await connectToDatabase();
    const settings = await Settings.findOne();
    
    if (!settings) {
      return NextResponse.json({
        submissionOpen: false,
        message: "Submission period is currently closed."
      });
    }
    
    return NextResponse.json({
      submissionOpen: settings.submissionOpen,
      openedAt: settings.submissionOpenedAt || null,
      message: settings.submissionOpen 
        ? "Submission period is currently open. Submit your project now!"
        : "Submission period is currently closed. Please check back later."
    });
  } catch (error) {
    console.error('Failed to fetch submission status:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch submission status',
        submissionOpen: false,
        message: "Unable to determine submission status. Please try again later."
      },
      { status: 200 }
    );
  }
}
