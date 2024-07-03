import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Invoice } from '../schemas/invoice.schema';
import { Items } from '../schemas/items.schema';
import { Sold } from '../schemas/soldItems.schema';
import { ItemsService } from '../items/items.service';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
    @InjectModel(Items.name) private itemsModel: Model<Items>,
    @InjectModel(Sold.name) private soldItemsModel: Model<Sold>,
    private itemsService: ItemsService,
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
      const item = await this.itemsModel.findOneAndUpdate(
        { serialCode: items.art },
        { $inc: { qnt: -items.qty } },
        { new: true },
      );
      if (item !== null) {
        const soldItem: any = {
          ...item,
          _id: item._id.toString(),
          sold: items.qty,
          date: new Date().toLocaleDateString(),
        };

        await this.itemsService.soldItem(item._id.toString(), soldItem);
      }
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

  async getStats() {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const invoice = await this.invoiceModel.find({
      createdAt: { $gte: lastMonth },
    });

    const clientData = invoice.reduce((acc, invoice) => {
      if (!acc[invoice.clientName]) {
        acc[invoice.clientName] = { count: 0, totalAmount: 0 };
      }
      acc[invoice.clientName].count += 1;
      acc[invoice.clientName].totalAmount += invoice.totalPrice;
      return acc;
    }, {});

    const totalInvoices = invoice.length;

    const result = [];
    const resultPaid = [];

    for (const client in clientData) {
      const clientInfo = clientData[client];
      resultPaid.push({
        name: client,
        y: ((clientInfo.count / totalInvoices) * 100).toFixed(2), // Percentage of invoices
        totalAmount: clientInfo.totalAmount, // Sum of amounts
      });
      result.push({
        name: client,
        y: ((clientInfo.count / totalInvoices) * 100).toFixed(2), // Percentage of invoices
      });
    }
    const highestClient = resultPaid.reduce(
      (max: number, client: { y: number }) => {
        return client.y > max ? client.y : max;
      },
      resultPaid[0],
    );

    return { result, highestClient };
  }

  async getPeakSales() {
    let result: any;
    const results = [];
    const invoices = await this.invoiceModel.find();
    for (const invoice of invoices) {
      results.push({
        x: invoice.createdAt.toLocaleDateString(),
        y: (await invoice).totalPrice,
      });
    }
    const simplifiedArray = results.reduce((acc, curr) => {
      if (acc[curr.x]) {
        acc[curr.x].y += curr.y;
      } else {
        acc[curr.x] = { x: curr.x, y: curr.y };
      }
      return acc;
    }, {});

    // eslint-disable-next-line prefer-const
    result = Object.values(simplifiedArray);
    return result;
  }
}
