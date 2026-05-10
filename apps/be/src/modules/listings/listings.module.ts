import { Module } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';
import { CronRelistModule } from '../cronRelist/cronRelist.module';

@Module({
    imports: [CronRelistModule],
    controllers: [ListingsController],
    providers: [ListingsService],
})
export class ListingsModule {}
