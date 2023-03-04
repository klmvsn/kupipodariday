import { Length, MaxLength } from 'class-validator';
import { CommonEntity } from 'src/utils/CommonEntity';
import { Entity, Column, JoinTable, ManyToOne, ManyToMany } from 'typeorm';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Wishlist extends CommonEntity {
  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @MaxLength(1500)
  description: string;

  @Column()
  image: string;

  @ManyToMany(() => Wish, (wish) => wish.name)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
