import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from '../schemas/invoice.schema';
import { Items, ItemsSchema } from '../schemas/items.schema';
import { ItemsService } from '../items/items.service';
import { Sold, SoldSchema } from '../schemas/soldItems.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
    MongooseModule.forFeature([{ name: Items.name, schema: ItemsSchema }]),
    MongooseModule.forFeature([{ name: Sold.name, schema: SoldSchema }]),
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService, ItemsService],
})
export class InvoiceModule {}
