import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { PlanificationService } from './planification.service';
import { AddEventDto } from './dto/add-event.dto';
import { EditEventDto } from './dto/edit-event.dto';

@Controller('planification')
export class PlanificationController {
  constructor(private readonly planificationService: PlanificationService) {}

  @Post('add')
  async addEvent(@Body() addEventDto: AddEventDto) {
    return this.planificationService.addEvent(addEventDto);
  }

  @Get('all')
  async getEvents() {
    return this.planificationService.getEvents();
  }

  @Patch('edit/:id')
  async editEvent(@Param('id') id: string, @Body() editEventDto: EditEventDto) {
    return this.planificationService.editEvent(id, editEventDto);
  }

  @Delete('delete/:id')
  async deleteEvent(@Param('id') id: string) {
    return this.planificationService.deleteEvent(id);
  }
}