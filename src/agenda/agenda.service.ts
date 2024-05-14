import { Injectable } from '@nestjs/common';
import { CreateAgendaDto } from './dto/create-agenda.dto';
// import { UpdateAgendaDto } from './dto/update-agenda.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Agenda } from '../schemas/agenda.schema';

@Injectable()
export class AgendaService {
  constructor(@InjectModel(Agenda.name) private agendaModel: Model<Agenda>) {}
  async create(createAgendaDto: CreateAgendaDto) {
    if (createAgendaDto.date === new Date().toLocaleDateString()) {
      const updated = await this.agendaModel.findOneAndUpdate(
        { date: createAgendaDto.date },
        { $push: { lift: createAgendaDto.lift } },
        { new: true },
      );
      if (!updated) {
        const createdClient = new this.agendaModel(createAgendaDto);
        return createdClient.save();
      }
    } else {
      const createdClient = new this.agendaModel(createAgendaDto);
      return createdClient.save();
    }
  }

  async findAll(currentDate: any) {
    return await this.agendaModel.find({ date: currentDate.currentDate });
  }

  findOne(id: number) {
    return `This action returns a #${id} agenda`;
  }

  update(id: number, updateAgendaDto: any) {
    return `This action updates a #${id} agenda`;
  }

  remove(id: number) {
    return `This action removes a #${id} agenda`;
  }
}
