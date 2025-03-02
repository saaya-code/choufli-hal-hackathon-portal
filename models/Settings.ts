import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  submissionOpen: boolean;
  submissionOpenedAt?: Date;
  submissionClosedAt?: Date;
  lastUpdatedAt?: Date;
}

const settingsSchema = new Schema<ISettings>({
  submissionOpen: { type: Boolean, default: false },
  submissionOpenedAt: { type: Date },
  submissionClosedAt: { type: Date },
  lastUpdatedAt: { type: Date, default: Date.now }
});

export const Settings = mongoose.models.Settings || mongoose.model<ISettings>('Settings', settingsSchema);

export async function initializeSettings() {
  const settingsCount = await Settings.countDocuments();
  if (settingsCount === 0) {
    await Settings.create({
      submissionOpen: false,
      lastUpdatedAt: new Date()
    });
  }
}
