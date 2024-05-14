import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CarsModel } from './client.schema';
import { ClientModel } from '../agenda/dto/create-agenda.dto';

export class LiftModel {
  @Prop()
  lift: string;
  @Prop()
  time: string[];
  @Prop()
  car: CarsModel[];

  @Prop()
  client: ClientModel[];

  @Prop()
  description: string;
}

export type AgendaDocument = HydratedDocument<Agenda>;

@Schema({ timestamps: true })
export class Agenda {
  @Prop()
  lift: LiftModel[];

  @Prop()
  date: string;

  @Prop()
  estimation: number;
}

export const AgendaSchema = SchemaFactory.createForClass(Agenda);
