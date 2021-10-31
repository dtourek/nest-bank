import { Controller, Get, Post, Body, Patch, Param, Delete, Request, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payments.dto';
import { ICommonAuthenticatedRequest } from '../../interfaces';
import { either } from 'fputils';

const whenError = (error: Error): void => {
  throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
};

const whenSuccess = <T>(payment: T) => payment;

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async create(@Request() { user }: ICommonAuthenticatedRequest, @Body() createPaymentDto: CreatePaymentDto) {
    return either(whenError, whenSuccess, await this.paymentsService.create(user.username, createPaymentDto));
  }

  @Get()
  async findMany(@Request() { user }: ICommonAuthenticatedRequest) {
    return either(whenError, whenSuccess, await this.paymentsService.findMany(user.username));
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() { user }: ICommonAuthenticatedRequest) {
    return either(whenError, whenSuccess, await this.paymentsService.findOne(+id, user.username));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Request() { user }: ICommonAuthenticatedRequest, @Body() updatePaymentDto: UpdatePaymentDto) {
    return either(whenError, whenSuccess, await this.paymentsService.update(+id, user.username, updatePaymentDto));
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() { user }: ICommonAuthenticatedRequest) {
    return either(whenError, whenSuccess, await this.paymentsService.remove(+id, user.username));
  }
}
