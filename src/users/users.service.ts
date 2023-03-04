import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { FindUserDto } from './dto/find-user.dto';
import { HashService } from 'src/hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Wish)
    private hashServise: HashService,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    return user;
  }

  async findByUsername(username: string) {
    const user = await this.usersRepository.findOne({
      where: {
        username: username,
      },
    });
    return user;
  }

  findMany({ query }: FindUserDto): Promise<User[]> {
    return this.usersRepository.find({
      where: [{ email: query }, { username: query }],
    });
  }

  async getUserWishes(id: number) {
    const wishes = await this.wishesRepository.find({
      where: { owner: { id } },
      relations: ['owner'],
    });
    return wishes;
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashServise.getHash(
        updateUserDto.password,
      );
    }
    await this.usersRepository.update({ id }, updateUserDto);
    const updatedUser = await this.findOne(id);
    delete updatedUser.password;
    return updatedUser;
  }

  async remove(id: number) {
    return await this.usersRepository.delete({ id });
  }
}
