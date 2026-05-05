import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { UserGuard } from '../../common/auth/guards/user.guard';
import { AuthenticatedUser } from '../../common/auth/interfaces/authenticatedUser.interface';
import { GetListingsQueryDto } from './dto/getListingQuery.dto';
import { CreateListingDto } from './dto/createListing.dto';

@Controller('listings')
export class ListingsController {
    constructor(private readonly listingsService: ListingsService) { }

    @Post()
    @UseGuards(UserGuard)
    createListing(
        @Req() req: { user: AuthenticatedUser },
        @Body() dto: CreateListingDto,
    ) {
        return this.listingsService.createListing(req.user.id, dto);
    }

    @Get()
    getListings(@Query() query: GetListingsQueryDto) {
        return this.listingsService.getListingsPaginated(query);
    }
}
