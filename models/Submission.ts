import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmission extends Document {
  teamId: mongoose.Types.ObjectId;
  githubUrl?: string;
  deployedUrl?: string;
  presentationUrl?: string;
  fileUrl?: string;
  fileName?: string;
  submittedAt: Date;
}

const submissionSchema = new Schema<ISubmission>({
  teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true, unique: true },
  githubUrl: { type: String },
  deployedUrl: { type: String },
  presentationUrl: { type: String },
  fileUrl: { type: String },
  fileName: { type: String },
  submittedAt: { type: Date, default: Date.now }
},{
    timestamps: true
}
);

export const Submission = mongoose.models.Submission || mongoose.model<ISubmission>('Submission', submissionSchema);
