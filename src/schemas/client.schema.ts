import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, now } from 'mongoose';

export type ClientDocument = HydratedDocument<Client>;

@Schema({ timestamps: true })
export class Client {
  @Prop()
  fullname: string;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop()
  email: string;

  @Prop(mongoose.Schema.Types.Array)
  cars?: CarsModel[];

  @Prop(mongoose.Schema.Types.Array)
  service: Service[];
}

export const ClientSchema = SchemaFactory.createForClass(Client);

export interface CarsModel {
  id: mongoose.Schema.Types.UUID;
  model: string;
  make: string;
  year: string;
  engine: string;
}

class Service {
  @Prop()
  serviceId: mongoose.Schema.Types.UUID;

  @Prop()
  carId: mongoose.Schema.Types.UUID;

  @Prop()
  km: string;

  @Prop()
  engineOil: boolean;

  @Prop()
  airFilter: boolean;

  @Prop()
  oilFilter: boolean;

  @Prop()
  pumpFilter: boolean;

  @Prop()
  airConFilter: boolean;

  @Prop()
  description: string;

  @Prop()
  invoiceId?: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}
