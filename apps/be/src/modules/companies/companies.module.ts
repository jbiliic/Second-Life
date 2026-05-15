import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
    controllers: [CompaniesController],
    providers: [CompaniesService, CloudinaryService],
})
export class CompaniesModule {}
