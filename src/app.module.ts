import { Module } from '@nestjs/common';
import { TypeOrmCoreModule } from '@nestjs/typeorm/dist/typeorm-core.module';
import { ConfigModule } from '@nestjs/config';
import { getEnvironmentVariable } from './helpers';
import UserEntity from './entities/UserEntity';
import PaymentEntity from './entities/PaymentEntity';
import { AuthModule } from './modules/auth/auth.module';
import { AppController } from './app.controller';
import { UsersModule } from './modules/users/usersModule';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/jwt/jwt-auth.guard';
import { PaymentsModule } from './modules/payments/payments.module';

if (process.env.NODE_ENV === 'development') {
  process.env.PORT = '3001';
  process.env.DB_HOST = 'localhost';
  process.env.DB_PORT = '5432';
  process.env.DB_USERNAME = 'postgres';
  process.env.DB_PASSWORD = 'postgres';
  process.env.JWT_SECRET = 'someSecretStuffLikePassword123';
}

interface IDatabase {
  type: 'postgres';
  host: string;
  port: number;
  username: string;
  password: string;
  entities: Function[];
  synchronize: true;
}

const databaseConfig: IDatabase = {
  type: 'postgres',
  host: getEnvironmentVariable('DB_HOST'),
  port: Number(getEnvironmentVariable('DB_PORT')),
  username: getEnvironmentVariable('DB_USERNAME'),
  password: getEnvironmentVariable('DB_PASSWORD'),
  entities: [UserEntity, PaymentEntity],
  synchronize: true,
};

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmCoreModule.forRoot(databaseConfig), AuthModule, UsersModule, PaymentsModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
