import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { getEnvironmentVariable, logger } from './helpers';

const port = Number(getEnvironmentVariable('PORT'));

const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { logger: ['log', 'error', 'warn', 'debug', 'verbose'] });
  await app.listen(port);
  logger('debug', `App is running on ${port}`);
};
bootstrap();
