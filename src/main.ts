import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { getEnvironmentVariable } from './helpers';

const port = getEnvironmentVariable('PORT');

const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await app.listen(port);
};
bootstrap();
