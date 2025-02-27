import mongoose, { Schema, Document } from 'mongoose';
import { ITeamMember } from './Team';

export interface IWaitlist extends Document {
  teamName: string;
  teamSize: number;
  experience?: string;
  teamMembers: ITeamMember[];
  registeredAt: Date;
}

const waitlistTeamMemberSchema = new Schema<ITeamMember>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true }
});



const waitlistSchema = new Schema<IWaitlist>({
  teamName: { type: String, required: true },
  teamSize: { type: Number, required: true, min: 1 },
  experience: { type: String, required: false, default: "No Experience Provided." },
  teamMembers: {
    type: [waitlistTeamMemberSchema],
    default: []
  },
  registeredAt: { type: Date, default: Date.now }
});

export const Waitlist = mongoose.models.Waitlist || mongoose.model<IWaitlist>('Waitlist', waitlistSchema);