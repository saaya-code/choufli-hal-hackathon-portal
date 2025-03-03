'use server'

import { connectToDatabase } from '@/lib/mongodb';
import { Submission } from '@/models/Submission';
import { Team } from '@/models/Team';
import { Settings } from '@/models/Settings';
import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabaseClient';

async function uploadFileToSupabase(file: File, teamName: string) {
  if (!file) return null;
  
  if (file.size > 30 * 1024 * 1024) {
    throw new Error("File size exceeds 30MB limit");
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${teamName}-${Date.now()}.${fileExt}`;
  
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, error } = await supabase
    .storage
    .from('submissions')
    .upload(fileName, buffer, {
      contentType: file.type
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase
    .storage
    .from('submissions')
    .getPublicUrl(fileName);

  return {
    fileUrl: publicUrl,
    fileName: file.name
  };
}

export async function submitProject(initialState: { message: string, error: string }, formData: FormData) {
  try {
    await connectToDatabase();
    
    const settings = await Settings.findOne();
    if (!settings || !settings.submissionOpen) {
      return {
        message: "",
        error: "Submission period is currently closed. Please check back later."
      };
    }

    const teamId = formData.get('teamId') as string;
    const githubUrl = formData.get('githubUrl') as string;
    const deployedUrl = formData.get('deployedUrl') as string;
    const presentationUrl = formData.get('presentationUrl') as string;
    
    let file: File | null = null;
    if (formData.has('file')) {
      const fileEntry = formData.get('file');
      if (fileEntry instanceof File && fileEntry.size > 0) {
        file = fileEntry;
      }
    }

    if (!teamId) {
      return {
        message: "",
        error: "Team ID is required"
      };
    }

    if (!githubUrl && !deployedUrl && !presentationUrl && !file) {
      return {
        message: "",
        error: "You must provide at least one URL or upload a project file"
      };
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return {
        message: "",
        error: "Team not found"
      };
    }

    const existingSubmission = await Submission.findOne({ teamId });
    const isUpdate = !!existingSubmission;
    const teamName = team.teamName;
    
    let fileData = null;
    if (file && file.size > 0) {
      try {
        fileData = await uploadFileToSupabase(file, teamName);
      } catch (error) {
        return {
          message: "",
          error: error instanceof Error ? error.message : "File upload failed"
        };
      }
    }

    const submissionData = {
      teamId,
      githubUrl: githubUrl || undefined,
      deployedUrl: deployedUrl || undefined,
      presentationUrl: presentationUrl || undefined,
      ...(fileData ? { fileUrl: fileData.fileUrl, fileName: fileData.fileName } : {})
    };

    if (isUpdate) {
      await Submission.findByIdAndUpdate(existingSubmission._id, submissionData);
    } else {
      await Submission.create(submissionData);
    }

    revalidatePath('/submit');
    
    return {
      message: isUpdate 
        ? "Your project has been updated successfully!" 
        : "Your project has been submitted successfully!",
      error: ""
    };
  } catch (error) {
    console.error('Submission error:', error);
    
    return {
      message: "",
      error: error instanceof Error 
        ? error.message 
        : "Failed to submit project. Please try again."
    };
  }
}
