import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from '../payments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType, repositoryMockFactory } from '../../../testHelpers';
import PaymentEntity from '../../../entities/PaymentEntity';
import UserEntity from '../../../entities/UserEntity';
import { Repository } from 'typeorm';
import { isLeft, isRight } from 'fputils';

const mockPayment: PaymentEntity = { id: 1, description: 'desc', amount: 5, owner: { id: 1, username: 'john', password: 'xx' } };

describe('PaymentsService', () => {
  let service: PaymentsService;
  let paymentRepository: MockType<Repository<PaymentEntity>>;
  let userRepository: MockType<Repository<UserEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: getRepositoryToken(PaymentEntity), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(UserEntity), useFactory: repositoryMockFactory },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    paymentRepository = module.get(getRepositoryToken(PaymentEntity));
    userRepository = module.get(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should fail when find user returns rejected value ', async () => {
      userRepository.findOne.mockRejectedValueOnce('Failed!');

      const result = await service.create('user', { amount: 1000, description: 'School expense' });

      expect(isLeft(result) && result.value).toEqual('Failed!');
    });

    it('should fail when user not found in database', async () => {
      userRepository.findOne.mockResolvedValueOnce(undefined);

      const result = await service.create('user', { amount: 5, description: 'Coffee' });
      expect(isLeft(result) && result.value).toEqual(Error('Cannot create payment, user user not found!'));
    });

    it('should success to create payment', async () => {
      const mockedPayment = {
        id: 5,
        description: 'description',
        amount: 1000,
        owner: {
          id: 36,
          username: 'john',
          password: 'xx',
        },
      };
      userRepository.findOne.mockResolvedValueOnce({ id: 1, username: 'john', password: 'xx' });
      paymentRepository.save.mockResolvedValueOnce(mockedPayment);

      const result = await service.create('john', { amount: 5, description: 'Coffee' });

      expect(isRight(result) && result.value).toEqual(mockedPayment);
    });
  });

  describe('findMany', () => {
    it('should fail', async () => {
      paymentRepository.find.mockRejectedValueOnce(new Error('Failed'));
      const result = await service.findMany('xx');

      if (isRight(result)) {
        fail(`Should not success`);
      }
      expect(result.value).toEqual(Error('Failed'));
    });

    it('should success and return empty array', async () => {
      paymentRepository.find.mockResolvedValueOnce([mockPayment]);
      const result = await service.findMany('john');

      if (isLeft(result)) {
        fail(`Should not fail. ${result.value}`);
      }

      expect(result.value).toEqual([mockPayment]);
    });
  });

  describe('findOne', () => {
    it('should fail to find payment', async () => {
      paymentRepository.findOne.mockRejectedValueOnce(new Error('Failed to get payment'));
      const payment = await service.findOne(1, 'user');

      if (isRight(payment)) {
        fail('Should not success');
      }
      expect(payment.value).toEqual(Error('Failed to get payment'));
    });

    it('should fail when username is wrong', async () => {
      paymentRepository.findOne.mockResolvedValueOnce(undefined);
      const payment = await service.findOne(1, 'user');

      if (isRight(payment)) {
        fail('Should not success');
      }
      expect(payment.value).toEqual(Error('Failed to get payment detail with ID: 1. Payment not found'));
    });

    it('should find a payment', async () => {
      paymentRepository.findOne.mockResolvedValueOnce(mockPayment);
      const result = await service.findOne(mockPayment.id, 'user');
      if (isLeft(result)) {
        fail(`Should not fail. ${result.value}`);
      }

      expect(result.value).toEqual(mockPayment);
    });
  });

  describe('update', () => {
    it('should fail', async () => {
      paymentRepository.findOne.mockRejectedValueOnce(new Error('Failed!'));
      const result = await service.update(5, 'user', { description: 'xx', amount: 10 });
      if (isRight(result)) {
        fail('Should not success');
      }
      expect(result.value).toEqual(Error('Failed!'));
    });

    it('should fail to update, because user differs', async () => {
      paymentRepository.findOne.mockResolvedValueOnce(undefined);
      const result = await service.update(1, 'user', mockPayment);

      if (isRight(result)) {
        fail('Should not success, user differs');
      }
      expect(result.value).toEqual(Error('Failed to update payment with ID: 1'));
    });

    it('should success to update payment', async () => {
      const updatedValue = { description: 'updated', amount: 10 };

      paymentRepository.findOne.mockResolvedValueOnce(mockPayment);
      paymentRepository.save.mockResolvedValueOnce({ ...mockPayment, ...updatedValue });

      const result = await service.update(mockPayment.id, 'user', updatedValue);
      if (isLeft(result)) {
        fail(`Should not fail. ${result.value}`);
      }
      expect(result.value).toEqual({
        amount: updatedValue.amount,
        description: updatedValue.description,
        id: 1,
        owner: {
          id: 1,
          password: 'xx',
          username: 'john',
        },
      });
    });
  });

  describe('remove', () => {
    it('should fail to delete', async () => {
      paymentRepository.findOne.mockRejectedValueOnce(new Error('Failed'));
      const result = await service.remove(3, 'user');
      if (isRight(result)) {
        fail('Should not success');
      }
      expect(result.value).toEqual(Error('Failed'));
    });

    it('should fail, because user does not match', async () => {
      paymentRepository.findOne.mockResolvedValueOnce(undefined);
      const result = await service.remove(3, 'user');
      if (isRight(result)) {
        fail(`Should not success`);
      }

      expect(result.value).toEqual(Error('Failed to delete payment with ID: 3, because it was not found'));
    });

    it('should success to delete', async () => {
      paymentRepository.findOne.mockResolvedValueOnce(mockPayment);
      paymentRepository.remove.mockResolvedValueOnce(mockPayment);
      const result = await service.remove(3, 'user');

      if (isLeft(result)) {
        fail(`Should not fail. ${result.value}`);
      }

      expect(result.value).toEqual(mockPayment);
    });
  });
});
