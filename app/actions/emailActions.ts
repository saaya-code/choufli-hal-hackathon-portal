/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { connectToDatabase } from "@/lib/mongodb";
import { Team } from "@/models/Team";
import { Waitlist } from "@/models/WaitlistTeam";
import { sendEmail } from "@/lib/mail";
import path from "path";
import fs from "fs";

type SendBulkEmailParams = {
  teamIds: string[];
  subject: string;
  message: string;
  isHtml?: boolean;
  useTemplateVars?: boolean;
  includeCertificates?: boolean;
};

export async function sendBulkEmail({
  teamIds,
  subject,
  message,
  isHtml = false,
  useTemplateVars = true,
  includeCertificates = false,
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

    const includeCertificatesAndCheckinData = includeCertificates;
    let checkinData: Record<string, boolean> = {};
    
    if (includeCertificatesAndCheckinData) {
      const response = await fetch(`${process.env.BASE_URL || 'http://localhost:3000'}/api/admin/checkin`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        return {
          success: false,
          error: "Failed to fetch check-in data"
        };
      }
      
      const data = await response.json();
      checkinData = data.teams.reduce((acc:any, team:any) => {
        team.members.forEach((member:any) => {
          if (member.checkedIn) {
            const key = member.memberId || member.memberEmail;
            acc[key] = true;
          }
        });
        return acc;
      }, {});
    }

    const certificatesDir = path.join(process.cwd(), 'public', 'certificates');

    for (const team of allTeams) {
      const teamData = {
        teamName: team.teamName,
        teamId: team._id.toString(),
        allMembers: team.teamMembers.map((m: any) => m.name).join(", "),
      };
      
      for (const member of team.teamMembers) {
        if (!member.email) continue;
        
        if (includeCertificatesAndCheckinData) {
          const memberKey = member._id?.toString() || member.email;
          if (!checkinData[memberKey]) {
            console.log(`Skipping certificate for ${member.name} - not checked in`);
            continue;
          }
        }
        
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
          const attachments = [];
          
          if (includeCertificates) {
            const possibleCertificatePaths = [
              // Format: Email-based filename (with @ replaced by _)
              path.join(certificatesDir, `${member.email.replace(/@/g, '_')}.png`),
              // Format: Name-based filename
              path.join(certificatesDir, `${member.name.replace(/\s+/g, '_')}.png`),
              // Format: Team folder with member name
              path.join(certificatesDir, team.teamName.replace(/\s+/g, '_'), `${member.name.replace(/\s+/g, '_')}.png`),
              // Format: Team ID folder with member name
              path.join(certificatesDir, team._id.toString(), `${member.name.replace(/\s+/g, '_')}.png`),
              // Format: Member ID-based file
              path.join(certificatesDir, `${member._id?.toString() || 'unknown'}.png`),
            ];
            
            let certificatePath = null;
            for (const potentialPath of possibleCertificatePaths) {
              if (fs.existsSync(potentialPath)) {
                certificatePath = potentialPath;
                break;
              }
            }
            
            if (certificatePath) {
              attachments.push({
                filename: `${member.name.replace(/\s+/g, '_')}_Certificate.png`,
                path: certificatePath,
                contentType: 'image/png',
              });
            } else {
              console.log(`Certificate not found for ${member.name} (${member.email})`);
            }
          }
          
          const result = await sendEmail({
            to: member.email,
            subject: personalizedSubject,
            message: personalizedMessage,
            isHtml,
            attachments,
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