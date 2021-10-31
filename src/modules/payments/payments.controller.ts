import { Controller, Get, Post, Body, Patch, Param, Delete, Request, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payments.dto';
import { ICommonAuthenticatedRequest } from '../../interfaces';
import { either } from 'fputils';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async create(@Request() { user }: ICommonAuthenticatedRequest, @Body() createPaymentDto: CreatePaymentDto) {
    return either(
      (error) => {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      },
      (result) => result,
      await this.paymentsService.create(user.username, createPaymentDto),
    );
  }

  @Get()
  async findMany(@Request() { user }: ICommonAuthenticatedRequest) {
    return either(
      (error) => {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      },
      (payments) => payments,
      await this.paymentsService.findMany(user.username),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() { user }: ICommonAuthenticatedRequest) {
    return either(
      (error) => {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      },
      (result) => result,
      await this.paymentsService.findOne(+id, user.username),
    );
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Request() { user }: ICommonAuthenticatedRequest, @Body() updatePaymentDto: UpdatePaymentDto) {
    return either(
      (error) => {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      },
      (result) => result,
      await this.paymentsService.update(+id, user.username, updatePaymentDto),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() { user }: ICommonAuthenticatedRequest) {
    return either(
      (error) => {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      },
      (result) => result,
      await this.paymentsService.remove(+id, user.username),
    );
  }
}
