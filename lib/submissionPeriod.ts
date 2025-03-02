import { connectToDatabase } from './mongodb';
import { Settings } from '@/models/Settings';

export const SUBMISSION_START_DATE = new Date('2025-03-05T00:00:00Z');
export const SUBMISSION_END_DATE = new Date('2025-03-06T00:00:00Z');

export async function isSubmissionPeriodActive(): Promise<boolean> {
  try {
    await connectToDatabase();
    const settings = await Settings.findOne();
    return settings?.submissionOpen || false;
  } catch (error) {
    console.error("Failed to check submission period:", error);
    return false;
  }
}

export async function getSubmissionPeriodStatus() {
  try {
    await connectToDatabase();
    const settings = await Settings.findOne();
    
    if (!settings || !settings.submissionOpen) {
      return {
        status: 'closed',
        message: "Submission period is currently closed. Please check back later."
      };
    }
    
    return {
      status: 'active',
      message: `Submission period is currently open. Submit your project now!`
    };
  } catch (error) {
    console.error("Failed to get submission status:", error);
    return {
      status: 'error',
      message: "Unable to determine submission status. Please try again later."
    };
  }
}
