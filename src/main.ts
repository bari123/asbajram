import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    credentials: true, // Enable sending credentials (cookies) with requests if needed
  });

  await app.listen(3000);
}

bootstrap();
Logger.log(`APP STARTED ON PORT ${3000}`);
