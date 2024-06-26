import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AgendaService } from './agenda.service';
import { CreateAgendaDto } from './dto/create-agenda.dto';
// import { UpdateAgendaDto } from './dto/update-agenda.dto';

@Controller('agenda')
export class AgendaController {
  constructor(private readonly agendaService: AgendaService) {}

  @Post()
  create(@Body() createAgendaDto: CreateAgendaDto) {
    return this.agendaService.create(createAgendaDto);
  }

  @Post('getAll')
  findAll(@Body() currentDate: any) {
    return this.agendaService.findAll(currentDate);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agendaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAgendaDto: any) {
    return this.agendaService.update(+id, updateAgendaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agendaService.remove(id);
  }

  @Post('/:id/finish')
  editService(@Param('id') serviceId: string) {
    return this.agendaService.editService(serviceId);
  }

  @Post('/:id/update')
  updateWithDrop(@Param('id') id: string, @Body() lift: any) {
    return this.agendaService.updateWithDrop(id, lift);
  }
}
