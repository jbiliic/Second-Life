import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserGuard } from '../../common/auth/guards/user.guard';
import { AuthenticatedUser } from '../../common/auth/interfaces/authenticatedUser.interface';
import { CreateListingDto } from './dto/createListing.dto';
import { GetListingsQueryDto } from './dto/getListingQuery.dto';
import { PaginatedListingsDto } from './dto/getListingsPaginated.dto';
import { GetListingDto } from './dto/getSingleListing.dto';
import { UpdateListingDto } from './dto/updateListing.dto';
import { ListingsService } from './listings.service';

@ApiTags('Listings')
@Controller('listings')
export class ListingsController {
    constructor(private readonly listingsService: ListingsService) {}

    @Get()
    @ApiOperation({ summary: 'Get paginated listings with filters' })
    @ApiResponse({ status: 200, type: PaginatedListingsDto })
    getListings(@Query() query: GetListingsQueryDto): Promise<PaginatedListingsDto> {
        return this.listingsService.getListingsPaginated(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a single listing by ID' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, type: GetListingDto })
    @ApiResponse({ status: 404, description: 'Listing not found' })
    getListing(
        @Param('id') id: string,
        @Req() req: { user?: AuthenticatedUser },
        @Query('lat') lat?: number,
        @Query('lng') lng?: number,
    ): Promise<GetListingDto> {
        return this.listingsService.getListingById(id, lat, lng);
    }

    @Post()
    @UseGuards(UserGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new listing' })
    @ApiResponse({ status: 201, type: GetListingDto })
    createListing(@Req() req: { user: AuthenticatedUser }, @Body() dto: CreateListingDto) {
        return this.listingsService.createListing(req.user.id, dto);
    }

    @Put(':id')
    @UseGuards(UserGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a listing (owner only)' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, type: GetListingDto })
    @ApiResponse({ status: 403, description: 'Forbidden — not the listing owner' })
    @ApiResponse({ status: 404, description: 'Listing not found' })
    updateListing(
        @Param('id') id: string,
        @Req() req: { user: AuthenticatedUser },
        @Body() dto: UpdateListingDto,
    ): Promise<GetListingDto> {
        return this.listingsService.updateListing(id, req.user.id, dto);
    }

    @Delete(':id')
    @UseGuards(UserGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a listing (owner only)' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 204, description: 'Listing deleted' })
    @ApiResponse({ status: 403, description: 'Forbidden — not the listing owner' })
    @ApiResponse({ status: 404, description: 'Listing not found' })
    deleteListing(@Param('id') id: string, @Req() req: { user: AuthenticatedUser }): Promise<void> {
        return this.listingsService.deleteListing(id, req.user.id);
    }
}
