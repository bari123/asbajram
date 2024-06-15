import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Items } from '../schemas/items.schema';

@Injectable()
export class ItemsService {
  constructor(@InjectModel(Items.name) private itemsModel: Model<Items>) {}
  create(createItemDto: CreateItemDto) {
    return new this.itemsModel(createItemDto).save();
  }

  async findAll() {
    return await this.itemsModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }

  async update(id: string, updateItemDto: UpdateItemDto) {
    return await this.itemsModel
      .findOneAndUpdate({ id: id }, updateItemDto)
      .exec();
  }

  async remove(id: string) {
    return await this.itemsModel.findOneAndDelete({ id: id }).exec();
  }

  async getItemsBySerialCode(serialCode) {
    return await this.itemsModel.findOne({ serialCode: serialCode }).exec();
  }
}
