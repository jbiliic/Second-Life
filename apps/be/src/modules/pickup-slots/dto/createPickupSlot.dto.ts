import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, Matches } from 'class-validator';

export class CreatePickupSlotDto {
    @ApiProperty({ example: '2026-12-31' })
    @IsDateString()
    date: string;

    @ApiProperty({ example: '09:00' })
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    start_time: string;

    @ApiProperty({ example: '17:00' })
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    end_time: string;
}
