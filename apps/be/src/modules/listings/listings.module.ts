import { Module } from '@nestjs/common';
import { CronRelistModule } from '../cronRelist/cronRelist.module';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
    imports: [CronRelistModule],
    controllers: [ListingsController],
    providers: [ListingsService, CloudinaryService],
})
export class ListingsModule {}
