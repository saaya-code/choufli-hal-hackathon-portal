import mongoose, { Schema, Document } from 'mongoose';

export interface ITeamMember {
  name: string;
  email: string;
  phone: string;
}

export interface ITeam extends Document {
  teamName: string;
  teamSize: number;
  experience: string;
  teamMembers: ITeamMember[];
}

const teamMemberSchema = new Schema<ITeamMember>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true }
});

const teamSchema = new Schema<ITeam>({
  teamName: { type: String, required: true },
  teamSize: { type: Number, required: true, min: 1 },
  experience: { type: String, required: true },
  teamMembers: { type: [teamMemberSchema], default: [] }
});

export default mongoose.model<ITeam>('Team', teamSchema);