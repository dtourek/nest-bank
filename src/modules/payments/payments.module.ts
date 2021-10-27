import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import PaymentEntity from '../../entities/PaymentEntity';
import UserEntity from '../../entities/UserEntity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity, UserEntity])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
