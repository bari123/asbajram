import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    // another common pattern
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,PATCH,DELETE,POST,PUT,OPTIONS',
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
    );
    next();
  });
  app.enableCors({
    origin: 'https://autoservicebajram.netlify.app',
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTION'],
    credentials: true,
  });

  await app.listen(3000);
}

bootstrap();
Logger.log(`APP STARTED ON PORT ${3000}`);
