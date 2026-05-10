import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsBoolean,
    IsEnum,
    IsNumber,
    IsOptional,
    IsDateString,
    IsUUID,
    IsArray,
    IsInt,
    IsUrl,
    Min,
    ValidateIf,
    ValidateNested,
    Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MaterialType, MaterialCondition, ListingCategory, UnitType } from '@prisma/client';

export class CreateListingImageDto {
    @ApiProperty({ example: 'https://cdn.example.com/image.png' })
    @IsUrl()
    image_url: string;

    @ApiProperty()
    @IsBoolean()
    is_primary: boolean;

    @ApiProperty()
    @IsInt()
    sort_order: number;
}

export class CreatePickupSlotDto {
    @ApiProperty({ example: '2026-12-31' })
    @IsDateString()
    date: string;

    @ApiProperty({ example: '09:00' })
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'end_time must be in HH:mm format' })
    @IsString()
    start_time: string;

    @ApiProperty({ example: '17:00' })
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'end_time must be in HH:mm format' })

    @IsString()
    end_time: string;
}

export class CreateRecurringScheduleDto {
    @ApiProperty({ example: '0 9 * * 1', description: 'Cron expression' })
    @IsString()
    cron_expression: string;

    @ApiProperty({ example: '2026-01-01' })
    @IsDateString()
    start_date: string;

    @ApiProperty({ example: '2026-12-31' })
    @IsDateString()
    end_date: string;
}

export class CreateListingDto {
    @ApiProperty()
    @IsUUID()
    location_id: string;

    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty({ enum: MaterialType })
    @IsEnum(MaterialType)
    material_type: MaterialType;

    @ApiProperty({ enum: MaterialCondition })
    @IsEnum(MaterialCondition)
    condition: MaterialCondition;

    @ApiProperty({ enum: ListingCategory })
    @IsEnum(ListingCategory)
    listing_category: ListingCategory;

    @ApiProperty()
    @IsBoolean()
    isReusable: boolean;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    quantity: number;

    @ApiProperty({ enum: UnitType })
    @IsEnum(UnitType)
    unit: UnitType;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    min_order: number;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    price_per_unit: number;

    @ApiProperty({ example: 'EUR' })
    @IsString()
    currency: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    delivery_available?: boolean;

    @ApiProperty({ example: '2026-12-31' })
    @IsDateString()
    available_until: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    is_recurring?: boolean;

    @ApiProperty({ type: [CreateListingImageDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateListingImageDto)
    images: CreateListingImageDto[];

    @ApiPropertyOptional({ type: [CreatePickupSlotDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreatePickupSlotDto)
    pickup_slots?: CreatePickupSlotDto[];

    @ApiPropertyOptional({ type: CreateRecurringScheduleDto })
    @ValidateIf((o) => o.is_recurring === true)
    @ValidateNested()
    @Type(() => CreateRecurringScheduleDto)
    recurring_schedule?: CreateRecurringScheduleDto;
}