import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { CommonEntity } from 'src/utils/CommonEntity';

@Entity()
export class Offer extends CommonEntity {
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @Column()
  amount: number;

  @Column({
    default: false,
  })
  hidden: boolean;
}
