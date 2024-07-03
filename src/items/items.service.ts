import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Items } from '../schemas/items.schema';
import { Sold } from '../schemas/soldItems.schema';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Items.name) private itemsModel: Model<Items>,
    @InjectModel(Sold.name) private soldItemsModel: Model<Sold>,
  ) {}

  async create(createItemDto: CreateItemDto) {
    return this.itemsModel.findOneAndUpdate(
      { serialCode: createItemDto.serialCode },
      { ...createItemDto },
      { upsert: true, new: true },
    );
  }

  async findAll() {
    return await this.itemsModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }

  async update(id: string, updateItemDto: UpdateItemDto) {
    return await this.itemsModel
      .findOneAndUpdate({ _id: id }, updateItemDto)
      .exec();
  }

  async soldItem(id: string, updateItemDto: any) {
    const existing = await this.soldItemsModel
      .findOne({
        date: updateItemDto.date,
        'items.item._id': updateItemDto._id,
      })
      .exec();

    if (!existing) {
      const existingDate = await this.soldItemsModel.findOne({
        date: updateItemDto.date,
      });
      if (!existingDate) {
        await this.soldItemsModel.create({
          items: [{ item: updateItemDto, count: +updateItemDto.sold }],
          date: updateItemDto.date,
        });
      } else {
        await this.soldItemsModel.findOneAndUpdate(
          {
            date: updateItemDto.date,
          },
          {
            $push: {
              items: { item: updateItemDto, count: +updateItemDto.sold },
            },
          },
        );
        return;
      }
    } else {
      await this.soldItemsModel.findOneAndUpdate(
        {
          date: updateItemDto.date,
          'items.item._id': updateItemDto._id,
        },
        {
          $inc: { 'items.$.count': +updateItemDto.sold }, // update the count for the existing item
        },
      );
    }
  }

  async getSoldItems(date: string) {
    return await this.soldItemsModel.find({ date: date }).exec();
  }

  async remove(id: string) {
    return await this.itemsModel.findOneAndDelete({ _id: id }).exec();
  }

  async getItemsBySerialCode(serialCode) {
    return await this.itemsModel.findOne({ serialCode: serialCode }).exec();
  }

  async getStatss() {
    const result = [];
    const dateSoldMap = new Map();
    const items = await this.soldItemsModel.find();

    for (const item of items) {
      for (const an of item.items) {
        const date = item.date;
        const count = parseInt(an.count);
        if (dateSoldMap.has(date)) {
          dateSoldMap.set(date, dateSoldMap.get(date) + count);
        } else {
          dateSoldMap.set(date, count);
        }
      }
    }

    dateSoldMap.forEach((sold, date) => {
      result.push({ x: date, y: sold });
    });

    return result;
  }

  async lastMonthStats() {
    let max = 0;
    let highestSellingItem;
    let lowestSellingItem;
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const items = await this.soldItemsModel
      .find({
        createdAt: { $gte: lastMonth },
      })
      .exec();
    for (const item of items) {
      for (const an of item.items) {
        if (parseInt(an.count) > max) {
          max = parseInt(an.count);
          highestSellingItem = an;
        }
        if (parseInt(an.count) <= 1) {
          lowestSellingItem = an;
        }
      }
    }

    return { highest: highestSellingItem, lowest: lowestSellingItem };
  }
}
