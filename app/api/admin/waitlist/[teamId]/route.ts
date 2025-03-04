import { connectToDatabase } from '@/lib/mongodb';
import { Team } from '@/models/Team';
import { Waitlist, IWaitlist } from '@/models/WaitlistTeam';
import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mail';
import { participationEmailTemplate } from '@/lib/emailTemplates';
export async function PATCH(req: Request, { params }: { params: Promise<{ teamId: string }>}) {
  const para = (await params);
  try {
    console.log(para);
    await connectToDatabase();
    const waitListedTeam = await Waitlist.findById<IWaitlist>(para.teamId);
    if(!waitListedTeam){
      return NextResponse.json("Team doesn't exist")
    }
    const newWaitListedTeam = {
      teamName: waitListedTeam?.teamName,
      teamSize: waitListedTeam?.teamSize,
      teamMembers: waitListedTeam?.teamMembers,
      experience: waitListedTeam?.experience
    }
    const team = new Team({
      ...newWaitListedTeam
    })

    await team.save();
    await Waitlist.findOneAndDelete({_id: waitListedTeam?._id})

    const {teamMembers, teamName } = newWaitListedTeam;
        await sendEmail({
          to: teamMembers.map(member => member.email).join(', '),
          subject: 'Choufli Hal 2.0 - Participation Confirmed!',
          html: participationEmailTemplate(teamName, teamMembers.map(t=>t.name), process.env.BASE_URL+"/contact")
        });
    return NextResponse.json({status: "done"})
   }catch(err){
    console.error(err)
  }
}