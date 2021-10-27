import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import PaymentEntity from './PaymentEntity';
import { Nullable } from '../interfaces';

@Entity()
class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  username: string;

  @Column({ type: 'text', nullable: false })
  password: string;

  @OneToMany(() => PaymentEntity, (payment) => payment.owner, { nullable: true })
  payments?: Nullable<PaymentEntity[]>;
}

export default UserEntity;
