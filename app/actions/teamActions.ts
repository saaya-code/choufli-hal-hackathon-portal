'use server'
import { connectToDatabase } from '@/lib/mongodb';
import { ITeamMember, Team } from '@/models/Team'
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { sendEmail } from '@/lib/mail';
import { participationEmailTemplate } from '@/lib/emailTemplates';
import { waitlistEmailTemplate } from '@/lib/waitListEmailTemplate';
import { Waitlist } from '@/models/WaitlistTeam';
import mongoose from 'mongoose';
const MAX_TEAMS = 40;

async function checkForDuplicateEmails(teamMembers: ITeamMember[]) {
  const emails = teamMembers.map(member => member.email);
  
  if (new Set(emails).size !== emails.length) {
    throw new Error("Each team member must have a unique email.");
  }

  for (const email of emails) {
    const existingTeamMember = await Team.findOne({ 'teamMembers.email': email });
    if (existingTeamMember) {
      throw new Error(`Email ${email} is already registered with another team.`);
    }
  }

  for (const email of emails) {
    const existingWaitlistMember = await Waitlist.findOne({ 'teamMembers.email': email });
    if (existingWaitlistMember) {
      throw new Error(`Email ${email} is already registered with another team on the waitlist.`);
    }
  }
}

export async function registerTeam(initialState: unknown, formData: FormData) {
  try {
    await connectToDatabase();
    const numberOfTeams = await Team.countDocuments({});
    if (numberOfTeams >= MAX_TEAMS) {
      await Waitlist.create({
        teamName: formData.get('teamName'),
        teamSize: Number(formData.get('teamSize')),
        experience: formData.get('experience') || undefined,
        teamMembers: JSON.parse(formData.get('teamMembers') as string)
      });
      return {
        message: "Maximum teams reached. You are on the waitlist!",
        error: ""
      };
    }

    const teamName = formData.get('teamName') as string;
    const teamSize = Number(formData.get('teamSize'));
    const experience = formData.get('experience') as string;
    const teamMembers = JSON.parse(formData.get('teamMembers') as string) as ITeamMember[];
    if (!teamName || !teamSize || !Array.isArray(teamMembers)) {
      throw new Error('Invalid form data');
    }

    await checkForDuplicateEmails(teamMembers);

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
      message: participationEmailTemplate(teamName, teamMembers.map(t=>t.name), process.env.BASE_URL+"/contact"),
      isHtml: true
    });
    
    revalidatePath('/')
    return {
      message: "Team registered successfully! Redirecting...",
      error: "",
    }
  } catch (error) {
    console.error('Registration error:', error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if((error as any)?.code === 11000){
      return {
        message: "",
        error: "Email already used. If you want to change your team members, please contact us.",
      }
    }    
    if (error instanceof z.ZodError) {
      return {
        message: "",
        error: "Invalid form data. Please check your inputs.",
      }
    }
    if(error instanceof mongoose.Error){
      return {
        message: "",
        error: "Email already used. Please check your inputs.",
      }
    }
    if(error instanceof Error) {
      return {
        message: "",
        error: error.message,
      }
    }

    return {
      message: "",
      error: "Failed to register team. Please try again.",
    }
  }
}

export async function registerTeamToWaitList(initialState: unknown, formData: FormData) {
  try {
    await connectToDatabase();
    const teamName = formData.get('teamName') as string;
    const teamSize = Number(formData.get('teamSize'));
    const experience = formData.get('experience') as string;
    const teamMembers = JSON.parse(formData.get('teamMembers') as string) as ITeamMember[];
    if (!teamName || !teamSize || !Array.isArray(teamMembers)) {
      throw new Error('Invalid form data');
    }

    await checkForDuplicateEmails(teamMembers);
    
    const numberOfWaitlistedTeams = await Waitlist.countDocuments({});
    const waitListTeam = new Waitlist({
      teamName,
      teamSize,
      experience,
      teamMembers
    });
    await waitListTeam.save();
    await sendEmail({
      to: teamMembers.map(member => member.email).join(', '),
      subject: 'Choufli Hal 2.0 - Successfully added to the waitlist!',
      message: waitlistEmailTemplate(teamName, numberOfWaitlistedTeams, process.env.BASE_URL+"/contact"),
      isHtml: true
    });

    return {
      message: "Team successfully added to the waitlist! Redirecting...",
      error: "",
    }
  } catch (error) {
    console.error('Registration error:', error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if((error as any)?.code === 11000){
      return {
        message: "",
        error: "Email already used. If you want to change your team members, please contact us.",
      }
    }  
    if (error instanceof z.ZodError) {
      return {
        message: "",
        error: "Invalid form data. Please check your inputs.",
      }
    }
    if(error instanceof Error) {
      return {
        message: "",
        error: error.message,
      }
    }

    return {
      message: "",
      error: "Failed to register team. Please try again.",
    }
  }
}
