import { CarsModel } from '../../schemas/client.schema';

export interface CreateClientDto {
  name: string;
  phone: string;
  address: string;
  email: string;
  cars: CarsModel;
}
