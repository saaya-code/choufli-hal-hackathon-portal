'use server'
import { connectToDatabase } from '@/lib/mongodb';
import Team, { ITeamMember } from '@/models/Team'
import { revalidatePath } from 'next/cache';
import { z } from 'zod';


export async function registerTeam(initialState: unknown, formData: FormData) {
  try {
    await connectToDatabase();
    await Team.syncIndexes();
    console.log(formData)
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
