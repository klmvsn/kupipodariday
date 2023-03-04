import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { CreateWishlistDto } from './dto/create-wishList.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    private wishesService: WishesService,
  ) {}

  async create(owner: User, createWishListDto: CreateWishlistDto) {
    delete owner.password;
    delete owner.email;
    const wishes = await this.wishesService.findMany({});
    const items = createWishListDto.itemsId.map((item) => {
      return wishes.find((wish) => wish.id === item);
    });
    const newWishList = this.wishlistsRepository.create({
      ...createWishListDto,
      owner: owner,
      items: items,
    });
    return this.wishlistsRepository.save(newWishList);
  }

  async findOne(query: FindOneOptions<Wishlist>): Promise<Wishlist> {
    return this.wishlistsRepository.findOne(query);
  }

  async findAll() {
    const wishlists = await this.wishlistsRepository.find({
      relations: {
        owner: true,
        items: true,
      },
    });
    wishlists.forEach((wishlist) => {
      delete wishlist.owner.password;
      delete wishlist.owner.email;
    });
    return wishlists;
  }

  async findWishlistsById(id: number) {
    return this.wishlistsRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });
  }

  async updateOne(
    user: User,
    wishlistId: number,
    updateWishlistDto: UpdateWishlistDto,
  ) {
    const wishlist = await this.findWishlistsById(wishlistId);
    if (!wishlist) {
      throw new NotFoundException('Вишлист не найден');
    }

    if (user.id !== wishlist.owner.id) {
      throw new ForbiddenException('Нельзя редактировать чужой список');
    }
    await this.wishlistsRepository.update(wishlistId, updateWishlistDto);
    const updatedWishList = await this.findOne({
      where: { id: wishlistId },
      relations: {
        owner: true,
        items: true,
      },
    });
    delete updatedWishList.owner.password;
    delete updatedWishList.owner.email;
    return updatedWishList;
  }

  async remove(wishlistId: number, userId: number) {
    const wishlist = await this.findOne({
      where: { id: wishlistId },
      relations: {
        owner: true,
        items: true,
      },
    });
    if (!wishlist) {
      throw new NotFoundException('Вишлист не найден');
    }

    if (userId !== wishlist.owner.id) {
      throw new ForbiddenException('Нельзя редактировать чужиой список');
    }
    await this.wishlistsRepository.delete(wishlistId);
    return wishlist;
  }
}
