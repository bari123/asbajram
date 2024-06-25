import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Invoice } from '../schemas/invoice.schema';
import { Items } from '../schemas/items.schema';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
    @InjectModel(Items.name) private itemsModel: Model<Items>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    if (
      !createInvoiceDto._id ||
      !Types.ObjectId.isValid(createInvoiceDto._id)
    ) {
      createInvoiceDto._id = new Types.ObjectId();
    }
    const existingInvoice = await this.invoiceModel
      .findOne({ _id: createInvoiceDto._id })
      .exec();

    if (!existingInvoice) {
      const allInvoices = await this.invoiceModel.find().exec();
      createInvoiceDto.invoiceId = allInvoices.length + 1; // Assign a new invoiceId
    }

    createInvoiceDto.totalPrice = createInvoiceDto.items.reduce(
      (total, item) => {
        return total + parseInt(item.total, 10);
      },
      0,
    );

    for (const items of createInvoiceDto.items) {
      await this.itemsModel.findOneAndUpdate(
        { serialCode: items.art },
        { $inc: { qnt: -items.qty } },
      );
    }
    return await this.invoiceModel
      .findOneAndUpdate({ _id: createInvoiceDto._id }, createInvoiceDto, {
        upsert: true,
        new: true,
      })
      .exec();
  }

  async findAll() {
    return await this.invoiceModel.find().exec();
  }

  async findOne(id: string) {
    return await this.invoiceModel.findOne({ _id: id }).exec();
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto) {
    return await this.invoiceModel
      .findOneAndUpdate({ _id: id }, updateInvoiceDto)
      .exec();
  }

  async remove(id: string) {
    return await this.invoiceModel.findOneAndDelete({ _id: id }).exec();
  }

  async pay(id) {
    return await this.invoiceModel
      .findOneAndUpdate({ _id: id }, { status: true })
      .exec();
  }

  async test(){
    return 'test'
  }
}
