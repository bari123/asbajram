import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ClientDocument = HydratedDocument<Items>;

@Schema({ timestamps: true })
export class Items {
  @Prop()
  name: string;

  @Prop()
  serialCode: string;

  @Prop()
  qnt: number;

  @Prop()
  price: number;

  @Prop()
  carAndYear: string;

  @Prop()
  description: string;

  @Prop()
  engineType: string;

  @Prop()
  shelfNumber: string;
}

export const ItemsSchema = SchemaFactory.createForClass(Items);
