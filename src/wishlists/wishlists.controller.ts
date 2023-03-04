import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Delete, Patch } from '@nestjs/common/decorators';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateWishlistDto } from './dto/create-wishList.dto';
import { UpdateWishlistDto } from './dto/update-wishList.dto';
import { WishlistsService } from './wishlists.service';

@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private wishlistsService: WishlistsService) {}

  @Get()
  async getWishlists() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  async getWishlistsById(@Param('id') id: string) {
    return this.wishlistsService.findWishlistsById(+id);
  }

  @Post()
  async create(@Body() createWishListDto: CreateWishlistDto, @Req() req) {
    return this.wishlistsService.create(req.user, createWishListDto);
  }

  @Patch(':id')
  async updateOne(
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.wishlistsService.updateOne(req.user, +id, updateWishlistDto);
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    return this.wishlistsService.remove(+id, req.user.id);
  }
}
