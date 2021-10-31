import { Repository } from 'typeorm';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock;
};

export const repositoryMockFactory: <T>() => MockType<Repository<T>> = jest.fn(() => ({
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
}));
