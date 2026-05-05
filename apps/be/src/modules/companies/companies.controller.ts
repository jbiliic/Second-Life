import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { AuthenticatedUser } from '../../common/auth/interfaces/authenticatedUser.interface';
import { UpdateMyProfileDto } from './dto/UpdateMyProfile.dto';
import { UserGuard } from '../../common/auth/guards/user.guard';

@Controller('/companies')
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) { }


    @Get('/me')
    @UseGuards(UserGuard)
    getProfile(@Req() req: { user: AuthenticatedUser }) {
        const id = req.user.id;
        console.log('Received request for company profile with ID:', id);
        return this.companiesService.getProfile(id);
    }

    @Post('/me')
    @UseGuards(UserGuard)
    updateProfile(@Req() req: { user: AuthenticatedUser }, @Body() updateCompanyDto: UpdateMyProfileDto) {
        return this.companiesService.updateProfile(req.user.id, updateCompanyDto);
    }

}
