import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) {}

  async create(user: User, createOfferDto: CreateOfferDto): Promise<Offer> {
    const wish = await this.wishesService.findOne(createOfferDto.itemId);
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    if (user.id === wish.owner.id) {
      throw new ForbiddenException('Нельзя скинуться на свой подарок');
    }
    const offerSum = Number(wish.raised) + Number(createOfferDto.amount);
    if (+offerSum > wish.price) {
      throw new ForbiddenException('Необходимая сумма собрана');
    }
    const newOffer = this.offersRepository.create({
      ...createOfferDto,
      user: user,
      item: wish,
    });

    if (newOffer.hidden === false) {
      delete newOffer.user;
      return this.offersRepository.save(newOffer);
    }

    delete newOffer.user.password;
    delete newOffer.user.email;
    delete newOffer.item.owner.password;
    delete newOffer.item.owner.email;

    return this.offersRepository.save(newOffer);
  }

  async findAll() {
    const offers = await this.offersRepository.find({
      relations: ['item', 'user'],
    });
    if (offers.length === 0) {
      throw new NotFoundException('Предложений не найдено');
    }
    return offers;
  }

  async findOne(id: number) {
    const offer = await this.offersRepository.find({
      where: { id },
      relations: ['item', 'user'],
    });
    if (offer.length === 0) {
      throw new NotFoundException('Таких предложений');
    }
    return offer;
  }
}
