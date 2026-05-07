import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { AuthenticatedUser } from '../../common/auth/interfaces/authenticatedUser.interface';
import { UpdateMyProfileDto } from './dto/UpdateMyProfile.dto';
import { UserGuard } from '../../common/auth/guards/user.guard';
import { PaymentMethodDto } from './dto/payment.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocationDto } from './dto/location.dto';

@ApiTags('Company')
@ApiBearerAuth()
@UseGuards(UserGuard)
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

    @Post('payment-methods')
    @ApiOperation({ summary: 'Add a new payment method to the company' })
    @ApiResponse({ status: 201, type: PaymentMethodDto })
    createPaymentMethod(
        @Req() req: { user: AuthenticatedUser },
        @Body() dto: Omit<PaymentMethodDto, 'id'>,
    ) {
        return this.companiesService.createAndAddPayment(req.user.id, dto);
    }

    @Get('payment-methods')
    @ApiOperation({ summary: 'Get all payment methods for the company' })
    @ApiResponse({ status: 200, type: PaymentMethodDto, isArray: true })
    getPaymentMethods(@Req() req: { user: AuthenticatedUser }) {
        return this.companiesService.getPaymentMethods(req.user.id);
    }
}
