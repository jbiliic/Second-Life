import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateRecurringScheduleDto {
    @ApiProperty({
        example: '0 0 * * 1',
        description: 'Cron expression — e.g. "0 0 * * 1" = every Monday at midnight',
    })
    @IsNotEmpty()
    @IsString()
    cron_expression: string;

    @ApiProperty({ example: '2025-01-01', description: 'Date from which the schedule is active' })
    @IsDateString()
    start_date: string;

    @ApiProperty({ example: '2025-12-31', description: 'Date after which the schedule stops' })
    @IsDateString()
    end_date: string;

    @ApiProperty({ example: true })
    @IsBoolean()
    is_active: boolean;
}
