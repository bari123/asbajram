import { ItemsModel } from '../../schemas/invoice.schema';

export class CreateInvoiceDto {
  name: string;
  items: ItemsModel[];
  totalPrice: number;
  invoiceId: number;
  _id: any;
  discount: number;
}
