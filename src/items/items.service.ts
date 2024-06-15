import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Items } from '../schemas/items.schema';

@Injectable()
export class ItemsService {
  constructor(@InjectModel(Items.name) private itemsModel: Model<Items>) {}
  async create(createItemDto: CreateItemDto) {
    return this.itemsModel.findOneAndUpdate(
      { serialCode: createItemDto.serialCode },
      { ...createItemDto },
      { upsert: true, new: true }  // upsert creates a new document if no match is found
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

  async remove(id: string) {
    return await this.itemsModel.findOneAndDelete({ _id: id }).exec();
  }

  async getItemsBySerialCode(serialCode) {
    return await this.itemsModel.findOne({ serialCode: serialCode }).exec();
  }
}
