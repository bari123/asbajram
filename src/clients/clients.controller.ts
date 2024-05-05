import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get('/getAll')
  findAll() {
    return this.clientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: CreateClientDto) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }

  @Post('/addCar/:id')
  addCar(@Body() updateBody: any, @Param('id') id: string) {
    return this.clientsService.addCar(updateBody, id);
  }

  @Get('/:id/getCars')
  getCars(@Param('id') id: string) {
    return this.clientsService.getCars(id);
  }

  @Delete('/:id/car/:carId')
  deleteCar(@Param('carId') carId: string, @Param('id') clientId: string) {
    return this.clientsService.deleteCar(carId, clientId);
  }

  @Post('/:id/service')
  addService(@Param('id') clientId: string, @Body() service: any) {
    service.createdAt = new Date().toLocaleDateString();
    return this.clientsService.addService(clientId, service);
  }

  @Get('/:id/services')
  getServies(@Param('id') id: string) {
    return this.clientsService.getServices(id);
  }

  @Get('/:id/services/:carId')
  getServicesByCar(@Param('id') id: string, @Param('carId') carId: string) {
    return this.clientsService.getServicesByCar(id, carId);
  }
}
