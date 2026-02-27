import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ApplicationDocument = Application & Document;

@Schema({ timestamps: true })
export class Application {
  @Prop({ type: Types.ObjectId, ref: 'Job', required: true })
  jobId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  workerId: Types.ObjectId;

  @Prop({
    default: 'pending',
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'noshow'],
  })
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'noshow';

  @Prop()
  confirmedAt?: Date;

  @Prop()
  completedAt?: Date;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
ApplicationSchema.index({ jobId: 1, workerId: 1 }, { unique: true });
