import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserGuard } from '../../common/auth/guards/user.guard';
import { AuthenticatedUser } from '../../common/auth/interfaces/authenticatedUser.interface';
import { CompaniesService } from './companies.service';
import { LocationDto } from './dto/location.dto';
import { UpdateLogoDto } from './dto/updateLogo.dto';
import { UpdateMyProfileDto } from './dto/UpdateMyProfile.dto';
import { PaymentMethodDto } from './dto/payment.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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

    @Post('/locations')
    @UseGuards(UserGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Add a new location to the company' })
    @ApiResponse({ status: 201, type: LocationDto })
    createLocation(
        @Req() req: { user: AuthenticatedUser },
        @Body() body: { latitude: number; longitude: number },
    ) {
        return this.companiesService.createLocationFromCoords(
            req.user.id,
            body.latitude,
            body.longitude,
        );
    }

    @Get('/locations')
    @ApiOperation({ summary: 'Get all locations for the company' })
    @ApiResponse({ status: 200, type: LocationDto, isArray: true })
    getLocations(@Req() req: { user: AuthenticatedUser }) {
        return this.companiesService.getLocations(req.user.id);
    }

    @Post('/payment-methods')
    @ApiOperation({ summary: 'Add a new payment method to the company' })
    @ApiResponse({ status: 201, type: PaymentMethodDto })
    createPaymentMethod(
        @Req() req: { user: AuthenticatedUser },
        @Body() dto: Omit<PaymentMethodDto, 'id'>,
    ) {
        return this.companiesService.createAndAddPayment(req.user.id, dto);
    }

    @Get('/payment-methods')
    @ApiOperation({ summary: 'Get all payment methods for the company' })
    @ApiResponse({ status: 200, type: PaymentMethodDto, isArray: true })
    getPaymentMethods(@Req() req: { user: AuthenticatedUser }) {
        return this.companiesService.getPaymentMethods(req.user.id);
    }

    @Patch('/me/logo')
    @ApiOperation({ summary: 'Update the company logo' })
    @ApiResponse({ status: 200, type: UpdateLogoDto })
    @UseInterceptors(FileInterceptor('file'))
    updateLogo(@Req() req: { user: AuthenticatedUser }, @UploadedFile() file: Express.Multer.File) {
        return this.companiesService.updateLogo(req.user.id, file);
    }

    @Get('/stats/co2-saved')
    @ApiOperation({ summary: 'Get CO2 saved in last 3 months' })
    @ApiResponse({ status: 200 })
    getCO2Saved(@Req() req: { user: AuthenticatedUser }) {
        return this.companiesService.getCO2Saved(req.user.id);
    }

    @Get('/stats/active-listings')
    @ApiOperation({ summary: 'Get number of active listings' })
    @ApiResponse({ status: 200 })
    getActiveListingsCount(@Req() req: { user: AuthenticatedUser }) {
        return this.companiesService.getActiveListingsCount(req.user.id);
    }

    @Get('/stats/profit-last-30-days')
    @ApiOperation({ summary: 'Get profit from last 30 days' })
    @ApiResponse({ status: 200 })
    getProfitLast30Days(@Req() req: { user: AuthenticatedUser }) {
        return this.companiesService.getProfitLast30Days(req.user.id);
    }
}
