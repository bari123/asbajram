import { CarsModel } from '../../schemas/client.schema';

export interface CreateAgendaDto {
  lift: {
    time: string[];
    lift: string;
    car: CarsModel;
    client: ClientModel;
    service: ServiceModel;
  };
  date: string;
  estimation: number;
}

export interface ClientModel {
  fullname: string;
  phone: string;
  address: string;
  email: string;
}

export interface ServiceModel {
  km: string;
  engineOil: boolean;
  airFilter: boolean;
  airConFilter: boolean;
  pumpFilter: boolean;
  oilFilter: boolean;
  description: string;
}
