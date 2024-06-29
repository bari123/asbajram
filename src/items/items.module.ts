import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Items, ItemsSchema } from '../schemas/items.schema';
import { Sold, SoldSchema } from '../schemas/soldItems.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Items.name, schema: ItemsSchema }]),
    MongooseModule.forFeature([{ name: Sold.name, schema: SoldSchema }]),
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}
