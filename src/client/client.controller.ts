import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientService } from './client.service';
import { AjouterClientDto } from './dto/ajouterClient.dto';
import { VisiteService } from 'src/visite/visite.service'; // Import VisiteService

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService,private readonly visiteService: VisiteService) {}

  @Post('/ajouterClient')
  create(@Body() ajouterClientDto: AjouterClientDto): Promise<{ client }> {
    return this.clientService.create(ajouterClientDto);
  }

  @Get('/client/:id')
async getVisitesByClient(@Param('id') clientId: string) {
  return await this.visiteService.findAllByClient(clientId);
}

@Get(':id')
async getClientWithVisites(@Param('id') id: string) {
  return await this.clientService.findById(id);
}

  @Get()
  findAll() {
    return this.clientService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientService.remove(+id);
  }
}
