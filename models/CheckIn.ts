import mongoose, { Schema, Document } from 'mongoose';

export interface ITeamMemberCheckIn {
  memberId: string;
  memberName: string;
  memberEmail: string;
  checkedIn: boolean;
  checkedInAt?: Date;
}

export interface ICheckIn extends Document {
  teamId: mongoose.Types.ObjectId;
  teamName: string;
  isTeamCheckedIn: boolean;
  checkedInAt?: Date;
  members: ITeamMemberCheckIn[];
}

const teamMemberCheckInSchema = new Schema<ITeamMemberCheckIn>({
  memberId: { type: String, required: true },
  memberName: { type: String, required: true },
  memberEmail: { type: String, required: true },
  checkedIn: { type: Boolean, default: false },
  checkedInAt: { type: Date }
});

const checkInSchema = new Schema<ICheckIn>({
  teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true, unique: true },
  teamName: { type: String, required: true },
  isTeamCheckedIn: { type: Boolean, default: false },
  checkedInAt: { type: Date },
  members: { type: [teamMemberCheckInSchema], default: [] }
}, {
  timestamps: true
});

export const CheckIn = mongoose.models.CheckIn || mongoose.model<ICheckIn>('CheckIn', checkInSchema);
