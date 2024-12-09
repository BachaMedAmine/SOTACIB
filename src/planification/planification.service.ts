import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from 'src/planification/schema/event.schema';
import { AddEventDto } from './dto/add-event.dto';
import { EditEventDto } from './dto/edit-event.dto';

@Injectable()
export class PlanificationService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  async addEvent(addEventDto: AddEventDto): Promise<Event> {
    const newEvent = new this.eventModel(addEventDto);
    return await newEvent.save();
  }

  async getEvents(): Promise<Event[]> {
    return await this.eventModel.find().sort({ date: 1 }).exec();
  }

  async editEvent(id: string, editEventDto: EditEventDto): Promise<Event> {
    const updatedEvent = await this.eventModel.findByIdAndUpdate(id, editEventDto, {
      new: true,
    });
    if (!updatedEvent) {
      throw new NotFoundException('Event not found');
    }
    return updatedEvent;
  }

  async deleteEvent(id: string): Promise<void> {
    const result = await this.eventModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Event not found');
    }
  }
}