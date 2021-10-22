import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Payment {
  @PrimaryGeneratedColumn()
  id: number;
}

export default Payment;
