import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, enum: ['employer', 'worker'] })
  type: 'employer' | 'worker';

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ default: false })
  verified: boolean;

  @Prop()
  bizNumber?: string;

  @Prop({ default: 0 })
  trustScore: number;

  @Prop({ default: 100 })
  attendanceRate: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
