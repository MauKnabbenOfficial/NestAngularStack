import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './event.schema';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private model: Model<Event>) {}
  create(dto: Partial<Event>) {
    return this.model.create(dto);
  }
  listByUser(userId: number) {
    return this.model
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
  }
}
