"use server";

import { connectToDatabase } from "@/lib/mongodb";
import { Team } from "@/models/Team";
import { Waitlist } from "@/models/WaitlistTeam";
import { sendEmail } from "@/lib/mail";

type SendBulkEmailParams = {
  teamIds: string[];
  subject: string;
  message: string;
  isHtml?: boolean;
  useTemplateVars?: boolean;
};

export async function sendBulkEmail({
  teamIds,
  subject,
  message,
  isHtml = false,
  useTemplateVars = true,
}: SendBulkEmailParams) {
  try {
    if (!teamIds || teamIds.length === 0) {
      return {
        success: false,
        error: "No recipient teams specified",
      };
    }

    if (!subject || !message) {
      return {
        success: false,
        error: "Subject and message are required",
      };
    }

    await connectToDatabase();

    const registeredTeams = await Team.find({
      _id: { $in: teamIds },
    });

    const waitlistedTeams = await Waitlist.find({
      _id: { $in: teamIds },
    });

    const allTeams = [...registeredTeams, ...waitlistedTeams];

    if (allTeams.length === 0) {
      return {
        success: false,
        error: "No valid teams found with the provided IDs",
      };
    }

    let successCount = 0;
    let failureCount = 0;

    for (const team of allTeams) {
      const teamData = {
        teamName: team.teamName,
        teamId: team._id.toString(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        allMembers: team.teamMembers.map((m: any) => m.name).join(", "),
      };
      
      for (const member of team.teamMembers) {
        if (!member.email) continue;
        
        let personalizedMessage = message;
        let personalizedSubject = subject;
        
        if (useTemplateVars) {
          const memberData = {
            memberName: member.name || "Participant",
            memberEmail: member.email,
          };
          
          personalizedSubject = replaceTemplateVars(subject, {
            ...teamData,
            ...memberData,
          });
          
          personalizedMessage = replaceTemplateVars(message, {
            ...teamData,
            ...memberData,
          });
        }
        
        try {
          const result = await sendEmail({
            to: member.email,
            subject: personalizedSubject,
            message: personalizedMessage,
            isHtml,
          });
          
          if (result.success) {
            successCount++;
          } else {
            failureCount++;
          }
        } catch (error) {
          console.error(`Failed to send email to ${member.email}:`, error);
          failureCount++;
        }
      }
    }

    console.log(`Email sending completed. Success: ${successCount}, Failed: ${failureCount}`);

    if (failureCount > 0 && successCount === 0) {
      return {
        success: false,
        error: `Failed to send any emails. Please check your configuration.`,
      };
    }

    if (failureCount > 0) {
      return {
        success: true,
        message: `Successfully sent ${successCount} emails, but ${failureCount} failed.`,
      };
    }

    return {
      success: true,
      message: `Successfully sent emails to ${successCount} recipients!`,
    };
  } catch (error) {
    console.error("Error sending bulk email:", error);
    return {
      success: false,
      error: "Failed to send emails. An unexpected error occurred.",
    };
  }
}

function replaceTemplateVars(text: string, data: Record<string, string>): string {
  let result = text;
  
  for (const [key, value] of Object.entries(data)) {
    const variable = `{{${key}}}`;
    result = result.replace(new RegExp(variable, 'g'), value || '');
  }
  
  return result;
}
