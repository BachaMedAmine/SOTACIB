import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlanificationService } from './planification.service';
import { PlanificationController } from './planification.controller';
import { Event, EventSchema } from './schema/event.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }])],
  providers: [PlanificationService],
  controllers: [PlanificationController],
})
export class PlanificationModule {}