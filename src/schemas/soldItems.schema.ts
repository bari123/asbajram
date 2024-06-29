import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Items } from './items.schema';

export type soldItemsDocument = HydratedDocument<Sold>;

@Schema({ timestamps: true })
export class Sold {
  @Prop() // Adjust this as per your actual Items schema type
  items: SoldItem[];

  @Prop()
  date: string;
}

export const SoldSchema = SchemaFactory.createForClass(Sold);

class SoldItem {
  @Prop()
  item: Items[];

  @Prop()
  count: string;
}
