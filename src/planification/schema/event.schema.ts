import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  title: string;

  @Prop()
  location?: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  clientName: string; // Client name added

  @Prop({ default: false })
  isCompleted: boolean;
}

export const EventSchema = SchemaFactory.createForClass(Event);