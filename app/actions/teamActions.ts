'use server'
import { connectToDatabase } from '@/lib/mongodb';
import { ITeamMember, Team } from '@/models/Team'
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { sendEmail } from '@/lib/mail';
import { participationEmailTemplate } from '@/lib/emailTemplates';

const MAX_TEAMS = 25;
export async function registerTeam(initialState: unknown, formData: FormData) {
  try {
    await connectToDatabase();
    const numberOfTeams = await Team.countDocuments({});
    if (numberOfTeams >= MAX_TEAMS) {
      return {
        message: "",
        error: "Maximum number of teams reached. Please contact us later.",
      }
    }

    const teamName = formData.get('teamName') as string;
    const teamSize = Number(formData.get('teamSize'));
    const experience = formData.get('experience') as string;
    const teamMembers = JSON.parse(formData.get('teamMembers') as string) as ITeamMember[];
    if (!teamName || !teamSize || !Array.isArray(teamMembers)) {
      throw new Error('Invalid form data');
    }

    const newTeam = new Team({
      teamName,
      teamSize,
      experience,
      teamMembers
    });

    await newTeam.save();
    await sendEmail({
      to: teamMembers.map(member => member.email).join(', '),
      subject: 'Choufli Hal 2.0 - Participation Confirmed!',
      html: participationEmailTemplate(teamName, teamMembers.map(t=>t.name), process.env.BASE_URL+"/contact")
    });
    
    revalidatePath('/')
    return {
      message: "Team registered successfully! Redirecting...",
      error: "",
    }
  } catch (error) {
    console.error('Registration error:', error)
    
    if (error instanceof z.ZodError) {
      return {
        message: "",
        error: "Invalid form data. Please check your inputs.",
      }
    }

    return {
      message: "",
      error: "Failed to register team. Please try again.",
    }
  }
}

export default Team;
