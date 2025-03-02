import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Settings } from '@/models/Settings';

export async function GET() {
  try {
    await connectToDatabase();
    const settings = await Settings.findOne();
    
    if (!settings) {
      const newSettings = await Settings.create({
        submissionOpen: false,
        lastUpdatedAt: new Date()
      });
      
      return NextResponse.json({
        submissionOpen: newSettings.submissionOpen,
        lastUpdatedAt: newSettings.lastUpdatedAt,
        openedAt: newSettings.submissionOpenedAt,
        closedAt: newSettings.submissionClosedAt
      });
    }
    
    return NextResponse.json({
      submissionOpen: settings.submissionOpen,
      lastUpdatedAt: settings.lastUpdatedAt,
      openedAt: settings.submissionOpenedAt,
      closedAt: settings.submissionClosedAt
    });
  } catch (error) {
    console.error('Failed to fetch submission status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submission status' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {    
    
    const { open } = await request.json();
    
    if (typeof open !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({
        submissionOpen: false,
      });
    }
    
    settings.submissionOpen = open;
    settings.lastUpdatedAt = new Date();
    
    if (open) {
      settings.submissionOpenedAt = new Date();
    } else {
      settings.submissionClosedAt = new Date();
    }
    
    await settings.save();
    
    return NextResponse.json({
      success: true,
      submissionOpen: settings.submissionOpen,
      lastUpdatedAt: settings.lastUpdatedAt,
      openedAt: settings.submissionOpenedAt,
      closedAt: settings.submissionClosedAt
    });
  } catch (error) {
    console.error('Failed to update submission status:', error);
    return NextResponse.json(
      { error: 'Failed to update submission status' },
      { status: 500 }
    );
  }
}
