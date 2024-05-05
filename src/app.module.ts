import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AgendaModule } from './agenda/agenda.module';

@Module({
  imports: [
    ClientsModule,
    AuthModule,
    MongooseModule.forRoot(
      'mongodb+srv://asbajram:bajramservice@cluster0.6c1zwy6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ),
    UserModule,
    AgendaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
