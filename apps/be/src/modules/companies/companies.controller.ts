import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserGuard } from '../../common/auth/guards/user.guard';
import { AuthenticatedUser } from '../../common/auth/interfaces/authenticatedUser.interface';
import { CompaniesService } from './companies.service';
import { LocationDto } from './dto/location.dto';
import { UpdateMyProfileDto } from './dto/UpdateMyProfile.dto';

@ApiTags('Company')
@ApiBearerAuth()
@UseGuards(UserGuard)
@Controller('/companies')
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) {}

    @Get('/me')
    getProfile(@Req() req: { user: AuthenticatedUser }) {
        const id = req.user.id;
        console.log('Received request for company profile with ID:', id);
        return this.companiesService.getProfile(id);
    }

    @Post('/me')
    updateProfile(
        @Req() req: { user: AuthenticatedUser },
        @Body() updateCompanyDto: UpdateMyProfileDto,
    ) {
        return this.companiesService.updateProfile(req.user.id, updateCompanyDto);
    }

    @Post('locations')
    @ApiOperation({ summary: 'Add a new location to the company' })
    @ApiResponse({ status: 201, type: LocationDto })
    createLocation(@Req() req: { user: AuthenticatedUser }, @Body() dto: Omit<LocationDto, 'id'>) {
        return this.companiesService.createAndAddLocation(req.user.id, dto);
    }

    @Get('locations')
    @ApiOperation({ summary: 'Get all locations for the company' })
    @ApiResponse({ status: 200, type: LocationDto, isArray: true })
    getLocations(@Req() req: { user: AuthenticatedUser }) {
        return this.companiesService.getLocations(req.user.id);
    }
}
