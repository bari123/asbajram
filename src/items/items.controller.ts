import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto);
  }

  @Get()
  findAll() {
    return this.itemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(+id);
  }

  @Get('serialCode/:id')
  findOneBySerialCode(@Param('id') id: string) {
    return this.itemsService.getItemsBySerialCode(id);
  }

  @Post('/:id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(id, updateItemDto);
  }

  @Post('/sold/:id')
  soldItem(@Param('id') id: string, @Body() updateItemDto: any) {
    return this.itemsService.soldItem(id, updateItemDto);
  }

  @Post('get/sold')
  getSoldItem(@Body() body: { date: string }) {
    return this.itemsService.getSoldItems(body.date);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(id);
  }
}
