import { Module } from '@nestjs/common';
import { CronRelistService } from './cronRelist.service';

@Module({
    controllers: [],
    providers: [CronRelistService],
    exports: [CronRelistService],
})
export class CronRelistModule {}
