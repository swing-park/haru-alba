import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type JobDocument = Job & Document;

@Schema({ timestamps: true })
export class Job {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  employerId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({
    type: {
      address: String,
      lat: Number,
      lng: Number,
    },
    required: true,
  })
  location: { address: string; lat: number; lng: number };

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endTime: string;

  @Prop({ required: true })
  pay: number;

  @Prop({ required: true, min: 1 })
  headcount: number;

  @Prop({ default: 'open', enum: ['open', 'closed', 'completed'] })
  status: 'open' | 'closed' | 'completed';
}

export const JobSchema = SchemaFactory.createForClass(Job);
JobSchema.index({ 'location.lat': 1, 'location.lng': 1 });
JobSchema.index({ date: 1, status: 1 });
