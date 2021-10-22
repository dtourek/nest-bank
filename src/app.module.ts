import { Module } from '@nestjs/common';
import { TypeOrmCoreModule } from '@nestjs/typeorm/dist/typeorm-core.module';
import { ConfigModule } from '@nestjs/config';
import { getEnvironmentVariable } from './helpers';
import UserEntity from './entities/UserEntity';
import PaymentEntity from './entities/PaymentEntity';
import { AuthModule } from './modules/auth/auth.module';

interface IDatabase {
  type: 'postgres';
  host: string;
  port: number;
  username: string;
  password: string;
  entities: Function[];
  synchronize: true;
}

interface IConfig {
  db: IDatabase;
}

const config: IConfig = {
  db: {
    type: 'postgres',
    host: getEnvironmentVariable('DB_HOST'),
    port: Number(getEnvironmentVariable('DB_PORT')),
    username: getEnvironmentVariable('DB_USERNAME'),
    password: getEnvironmentVariable('DB_PASSWORD'),
    entities: [UserEntity, PaymentEntity],
    synchronize: true,
  },
};

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmCoreModule.forRoot(config.db), AuthModule],
})
export class AppModule {}
