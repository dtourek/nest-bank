import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from '../payments.controller';
import { PaymentsService } from '../payments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import PaymentEntity from '../../../entities/PaymentEntity';
import { repositoryMockFactory } from '../../../testHelpers';
import UserEntity from '../../../entities/UserEntity';
import { ICommonAuthenticatedRequest } from '../../../interfaces';
import { ILeft, IRight } from 'fputils';
import { HttpException } from '@nestjs/common';

const mockedUser: ICommonAuthenticatedRequest = { user: { username: 'john', userId: 5 } };
const mockedPayment = { id: 1, amount: 1, description: 'xx', owner: { id: 1, username: 'xx', password: 'xx' } };

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let service: PaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        PaymentsService,
        { provide: getRepositoryToken(PaymentEntity), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(UserEntity), useFactory: repositoryMockFactory },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    service = module.get<PaymentsService>(PaymentsService);
  });

  describe('findOne', () => {
    it('should fail to get a payment and throw HttpException with status 400', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(async () => ({ tag: 'left', value: Error('Failed to get payment') } as ILeft<Error>));

      try {
        await controller.findOne(`${mockedPayment.id}`, mockedUser);

        fail('Should throw an error and fallback to catch block');
      } catch (error) {
        expect(error instanceof HttpException).toEqual(true);
        expect(error.message).toEqual('Failed to get payment');
        expect(error.status).toEqual(400);
      }
    });

    it('should success to get a payment', async () => {
      jest.spyOn(service, 'findMany').mockImplementation(async () => ({ tag: 'right', value: [mockedPayment] } as IRight<PaymentEntity[]>));

      const response = await controller.findMany(mockedUser);
      expect(response).toEqual([mockedPayment]);
    });
  });

  describe('findMany', () => {
    it('should fail to get payments and throw HttpException with status 400', async () => {
      jest.spyOn(service, 'findMany').mockImplementation(async () => ({ tag: 'left', value: Error('Failed to get payments') } as ILeft<Error>));

      try {
        await controller.findMany(mockedUser);

        fail('Should throw an error and fallback to catch block');
      } catch (error) {
        expect(error instanceof HttpException).toEqual(true);
        expect(error.message).toEqual('Failed to get payments');
        expect(error.status).toEqual(400);
      }
    });

    it('should success to get user payments', async () => {
      jest.spyOn(service, 'findMany').mockImplementation(async () => ({ tag: 'right', value: [mockedPayment] } as IRight<PaymentEntity[]>));

      const response = await controller.findMany(mockedUser);
      expect(response).toEqual([mockedPayment]);
    });
  });

  describe('create', () => {
    it('should fail to create payment', async () => {
      jest.spyOn(service, 'create').mockImplementation(async () => ({ tag: 'left', value: Error('Failed to create payment') } as ILeft<Error>));

      try {
        await controller.create(mockedUser, { amount: 3, description: 'New shoes' });

        fail('Should throw an error and fallback to catch block');
      } catch (error) {
        expect(error instanceof HttpException).toEqual(true);
        expect(error.message).toEqual('Failed to create payment');
        expect(error.status).toEqual(400);
      }
    });

    it('should success to create payment', async () => {
      jest.spyOn(service, 'create').mockImplementation(async () => ({ tag: 'right', value: mockedPayment } as IRight<PaymentEntity>));

      const response = await controller.create(mockedUser, { amount: mockedPayment.amount, description: mockedPayment.description });
      expect(response).toEqual(mockedPayment);
    });
  });

  describe('update', () => {
    it('should fail to update payment', async () => {
      jest.spyOn(service, 'update').mockImplementation(async () => ({ tag: 'left', value: Error('Failed to update payment') } as ILeft<Error>));

      try {
        await controller.update(`${mockedPayment.id}`, mockedUser, { amount: 3, description: 'New shoes' });

        fail('Should throw an error and fallback to catch block');
      } catch (error) {
        expect(error instanceof HttpException).toEqual(true);
        expect(error.message).toEqual('Failed to update payment');
        expect(error.status).toEqual(400);
      }
    });

    it('should success to update payment', async () => {
      jest.spyOn(service, 'update').mockImplementation(async () => ({ tag: 'right', value: mockedPayment } as IRight<PaymentEntity>));

      const response = await controller.update(`${mockedPayment.id}`, mockedUser, { amount: mockedPayment.amount, description: mockedPayment.description });
      expect(response).toEqual(mockedPayment);
    });
  });

  describe('delete', () => {
    it('should fail to remove payment', async () => {
      jest.spyOn(service, 'remove').mockImplementation(async () => ({ tag: 'left', value: Error('Failed to remove payment') } as ILeft<Error>));

      try {
        await controller.remove(`${mockedPayment.id}`, mockedUser);

        fail('Should throw an error and fallback to catch block');
      } catch (error) {
        expect(error instanceof HttpException).toEqual(true);
        expect(error.message).toEqual('Failed to remove payment');
        expect(error.status).toEqual(400);
      }
    });

    it('should success to delete payment', async () => {
      jest.spyOn(service, 'remove').mockImplementation(async () => ({ tag: 'right', value: mockedPayment } as IRight<PaymentEntity>));

      const response = await controller.remove(`${mockedPayment.id}`, mockedUser);
      expect(response).toEqual(mockedPayment);
    });
  });
});
