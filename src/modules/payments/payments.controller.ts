import { Controller, Get, Post, Body, Patch, Param, Delete, Request, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payments.dto';
import { ICommonAuthenticatedRequest } from '../../interfaces';
import { logger } from '../../helpers';
import { either } from 'fputils';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async create(@Request() { user }: ICommonAuthenticatedRequest, @Body() createPaymentDto: CreatePaymentDto) {
    logger('info', `Create payment initiated by user: ${user.username}`);
    return either(
      (error) => {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      },
      (result) => {
        logger('info', 'Payment created successfully', JSON.stringify(result));
        return result;
      },
      await this.paymentsService.create(user.username, createPaymentDto),
    );
  }

  @Get()
  async findMany(@Request() { user }: ICommonAuthenticatedRequest) {
    logger('info', `Requested find all payments for user: ${user.username}`);
    return either(
      (error) => {
        logger('error', `Failed to get user payments`, error.message);
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      },
      (payments) => {
        logger('info', `Get user payments succeeded`);
        return payments;
      },
      await this.paymentsService.findMany(user.username),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() { user }: ICommonAuthenticatedRequest) {
    return either(
      (error) => {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      },
      (result) => {
        return result;
      },
      await this.paymentsService.findOne(+id, user.username),
    );
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Request() { user }: ICommonAuthenticatedRequest, @Body() updatePaymentDto: UpdatePaymentDto) {
    return either(
      (error) => {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      },
      (result) => {
        return result;
      },
      await this.paymentsService.update(+id, user.username, updatePaymentDto),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() { user }: ICommonAuthenticatedRequest) {
    return either(
      (error) => {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      },
      (result) => {
        return result;
      },
      await this.paymentsService.remove(+id, user.username),
    );
  }
}
