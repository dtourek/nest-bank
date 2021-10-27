import { Injectable } from '@nestjs/common';
import PaymentEntity from '../../entities/PaymentEntity';
import { Left, Maybe, Right } from 'fputils';
import { InjectRepository } from '@nestjs/typeorm';
import UserEntity from '../../entities/UserEntity';
import { Repository } from 'typeorm';
import { logger } from '../../helpers';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payments.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentEntity)
    private paymentsRepository: Repository<PaymentEntity>,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  findPaymentByOwner = async (id, username) => this.paymentsRepository.findOne(id, { relations: ['owner'], where: { owner: { username } } });

  create = async (username: string, { amount, description }: CreatePaymentDto): Promise<Maybe<PaymentEntity>> => {
    try {
      const user = await this.usersRepository.findOne({ where: { username } });
      if (!user) {
        logger('error', `Failed to create payment, user not found`);
        return Left(new Error(`Cannot create payment, user ${username} not found!`));
      }

      const payment = new PaymentEntity();
      payment.owner = user;
      payment.description = description;
      payment.amount = amount;

      const result = await this.paymentsRepository.save(payment);
      logger('info', `Payment created successfully for user ${username}`);

      return Right(result);
    } catch (error) {
      logger('error', `Failed to create payment`, error);
      return Left(error);
    }
  };

  findMany = async (username: string): Promise<Maybe<PaymentEntity[]>> => {
    try {
      const result = await this.paymentsRepository.find({ relations: ['owner'], where: { owner: { username } } });
      logger('info', `Get user ${username} payments succeeded`);
      return Right(result);
    } catch (error) {
      const errorMessage = `Failed to get user ${username} payments`;
      logger('error', errorMessage, error);
      return Left(error);
    }
  };

  findOne = async (id: number, username: string): Promise<Maybe<PaymentEntity>> => {
    try {
      const result = await this.findPaymentByOwner(id, username);
      if (!result) {
        const message = `Failed to get payment detail with ID: ${id}. Payment not found`;
        logger('error', message);
        return Left(new Error(message));
      }
      logger('info', `Get payment detail with ID: ${id} succeeded`);
      return Right(result);
    } catch (error) {
      logger('error', `Get payment detail with ID: ${id} failed`, error);
      return Left(error);
    }
  };

  update = async (id: number, username: string, { description, amount }: UpdatePaymentDto): Promise<Maybe<PaymentEntity>> => {
    try {
      const payment = await this.findPaymentByOwner(id, username);
      if (!payment) {
        logger('error', `Failed to update payment with ID: ${id}, because payment not found!`);
        return Left(new Error(`Failed to update payment with ID: ${id}`));
      }
      payment.description = description ?? payment.description;
      payment.amount = amount ?? payment.amount;

      const result = await this.paymentsRepository.save(payment);

      logger('info', `Update payment with ID: ${id} succeeded`);
      return Right(result);
    } catch (error) {
      logger('error', `Failed to update payment with ID: ${id}`, error);
      return Left(error);
    }
  };

  remove = async (id: number, username: string): Promise<Maybe<PaymentEntity>> => {
    try {
      const payment = await this.findPaymentByOwner(id, username);
      if (!payment) {
        return Left(new Error(`Failed to delete payment with ID: ${id}, because it was not found`));
      }
      const result = await this.paymentsRepository.remove(payment);
      return Right(result);
    } catch (error) {
      return Left(error);
    }
  };
}