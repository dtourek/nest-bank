import { PartialType } from '@nestjs/mapped-types';

export class CreatePaymentDto {
  amount: number;
  description: string;
}

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {}

export class GetUserPaymentsDto {
  username: string;
}

export class RemovePaymentDto {
  id: number;
  username: string;
}
