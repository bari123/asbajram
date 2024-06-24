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
    const { date, estimation, lift } = createAgendaDto;

    if (estimation > 1) {
      lift.time = this.generateTimeSlots(lift.time, estimation);
    }

    lift.status = 'Not Done';

    const updated = await this.agendaModel.findOneAndUpdate(
      { date, estimation, lift },
      { $set: { lift: lift } },
      { new: true },
    );

    if (!updated) {
      const createdClient = new this.agendaModel(createAgendaDto);
      return createdClient.save();
    }
  }

  async findAll(currentDate: any) {
    return await this.agendaModel
      .find({ date: currentDate.currentDate })
      .exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} agenda`;
  }

  update(id: number, updateAgendaDto: any) {
    return `This action updates a #${id} agenda`;
  }

  remove(id: string) {
    return this.agendaModel.findOneAndDelete({ _id: id });
  }

  async editService(serviceId) {
    const existing = await this.agendaModel.findOne({ _id: serviceId });
    existing.lift[0].status = 'Done';
    return this.agendaModel.findOneAndUpdate(
      {
        _id: serviceId,
      },
      { $set: { lift: existing.lift } },
      { new: true },
    );
  }

  generateTimeSlots(startingTimeArray, numberOfSlots) {
    const [startHour, startMinute] = startingTimeArray.map(String);

    // Initialize an array to store the time slots
    const timeSlots = [];

    // Loop through the number of slots and generate each time slot
    for (let i = 0; i < numberOfSlots; i++) {
      // Calculate the current hour and minute
      let hour = parseInt(startHour) + i;

      // If the hour exceeds 24, loop back to the next day
      if (hour >= 24) {
        hour -= 24;
      }

      // Format the hour and minute to ensure they have two digits
      const formattedHour = hour.toString().padStart(2, '0');

      // Concatenate the hour and minute to create the time slot
      const timeSlot = `${formattedHour}:00`;

      // Push the time slot into the array
      timeSlots.push(timeSlot);
    }

    return timeSlots;
  }

  async updateWithDrop(id: string, lift) {
    console.log(lift);
    return await this.agendaModel.findOneAndUpdate({ _id: id }, lift).exec();
  }
}
