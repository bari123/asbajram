import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type InvoiceDocument = HydratedDocument<Invoice>;

export class ItemsModel {
  @Prop()
  art: string;

  @Prop()
  price: string;

  @Prop()
  qty: string;
}

@Schema({ timestamps: true })
export class Invoice {
  @Prop()
  clientName: string;

  @Prop()
  phone: string;

  @Prop()
  items: ItemsModel[];

  @Prop()
  totalPrice: number;

  @Prop()
  invoiceId: number;

  @Prop()
  discount: string;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
