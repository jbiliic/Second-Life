import { Module } from '@nestjs/common';
import { CronRelistModule } from '../cronRelist/cronRelist.module';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';

@Module({
    imports: [CronRelistModule],
    controllers: [ListingsController],
    providers: [ListingsService],
})
export class ListingsModule {}
