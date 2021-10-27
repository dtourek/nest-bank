import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import UserEntity from './UserEntity';

@Entity()
class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'int', nullable: false })
  amount: number;

  @ManyToOne(() => UserEntity, (user) => user.payments, { nullable: false })
  @JoinColumn()
  owner: UserEntity;
}

export default Payment;
