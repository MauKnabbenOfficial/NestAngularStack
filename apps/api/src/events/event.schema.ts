import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, collection: 'activity_events' })
export class Event {
  @Prop({ required: true }) userId!: number;
  @Prop({ required: true }) type!: string; // 'view' | 'quiz' | 'error'...
  @Prop({ type: Object }) payload?: Record<string, unknown>;
}

export const EventSchema = SchemaFactory.createForClass(Event);
export type EventDocument = Event & Document;
