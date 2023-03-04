import { CommonEntity } from 'src/utils/CommonEntity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Length, IsUrl, IsInt } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';

@Entity()
export class Wish extends CommonEntity {
  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column()
  @IsInt()
  price: number;

  @Column({
    default: 0,
  })
  @IsInt()
  raised: number;

  @ManyToOne(() => User, (owner) => owner.wishes)
  owner: User;

  @Column()
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({
    default: 0,
  })
  copied: number;
}
