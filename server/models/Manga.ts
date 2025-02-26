import mongoose, { Document } from 'mongoose';

export interface IStatusChange {
  status: string;
  timestamp: Date;
}

export interface IManga extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  malId: number;
  title: string;
  description: string;
  coverImage: string;
  status: 'Reading' | 'To Be Read' | 'Read';
  ownership: 'Owned' | 'Not Owned';
  addedAt: Date;
  statusHistory: IStatusChange[];
}

const StatusChangeSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const MangaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  malId: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Reading', 'To Be Read', 'Read'],
    default: 'To Be Read',
  },
  ownership: {
    type: String,
    enum: ['Owned', 'Not Owned'],
    default: 'Owned',
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
  statusHistory: [StatusChangeSchema],
});

// Create a compound index for userId and malId to prevent duplicates
MangaSchema.index({ userId: 1, malId: 1 }, { unique: true });

export default mongoose.model<IManga>('Manga', MangaSchema);
