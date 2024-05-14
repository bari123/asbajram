import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from '../schemas/client.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ClientsService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Client.name) private clientModel: Model<Client>,
  ) {}

  create(createClientDto: CreateClientDto) {
    const createdClient = new this.clientModel(createClientDto);
    return createdClient.save();
  }

  async findAll() {
    return await this.clientModel.find().exec();
  }

  async findOne(id: string) {
    return await this.clientModel.findOne({ _id: id }).exec();
  }

  async update(id: string, updateClientDto: CreateClientDto) {
    return this.clientModel.findOneAndUpdate({ _id: id }, updateClientDto);
  }

  async remove(id: string) {
    return await this.clientModel.findByIdAndDelete({ _id: id }).exec();
  }

  async addCar(updateBody, id) {
    updateBody._id = uuidv4();
    return this.clientModel.findOneAndUpdate(
      { _id: id },
      { $push: { cars: updateBody } },
      { new: true },
    );
  }

  getCars(id: string) {
    return this.clientModel.findOne({ _id: id }, 'cars');
  }

  deleteCar(carId, clientId) {
    return this.clientModel.findOneAndUpdate(
      { _id: clientId },
      { $pull: { cars: { _id: carId } } },
      { new: true },
    );
  }

  editCar(carId, clientId, car) {
    return this.clientModel.findOneAndUpdate(
      { _id: clientId, 'cars._id': carId },
      { cars: car },
    );
  }

  addService(clientId: string, service: any) {
    service.serviceId = uuidv4();
    return this.clientModel.findOneAndUpdate(
      { _id: clientId },
      { $push: { service: service } },
      { new: true },
    );
  }

  getServices(id) {
    return this.clientModel
      .findOne({ _id: id }, 'service')
      .limit(5)
      .sort({ createdAt: -1 });
  }

  getServicesByCar(id: string, carId: string) {
    const test = this.clientModel.findOne(
      { _id: id, 'service.carId': carId },
      { service: 1, cars: 1 },
    );
    console.log(test);

    return test;
  }
}
