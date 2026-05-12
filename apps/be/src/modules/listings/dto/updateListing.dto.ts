import { ApiPropertyOptional } from '@nestjs/swagger';
import { ListingCategory, MaterialCondition, MaterialType, UnitType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
    IsBoolean,
    IsDateString,
    IsEnum,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
} from 'class-validator';

export class UpdateListingDto {
    @ApiPropertyOptional({ example: 'EUR pallets - 120x80cm, good condition' })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({ example: 'Lightly used EUR pallets, suitable for reuse.' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ enum: MaterialType, example: MaterialType.wood })
    @IsOptional()
    @IsEnum(MaterialType)
    material_type?: MaterialType;

    @ApiPropertyOptional({ enum: MaterialCondition, example: MaterialCondition.B })
    @IsOptional()
    @IsEnum(MaterialCondition)
    condition?: MaterialCondition;

    @ApiPropertyOptional({ enum: ListingCategory, example: ListingCategory.pallets })
    @IsOptional()
    @IsEnum(ListingCategory)
    listing_category?: ListingCategory;

    @ApiPropertyOptional({ example: 500 })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    quantity?: number;

    @ApiPropertyOptional({ enum: UnitType, example: UnitType.kom })
    @IsOptional()
    @IsEnum(UnitType)
    unit?: UnitType;

    @ApiPropertyOptional({ example: 10 })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    min_order?: number;

    @ApiPropertyOptional({ example: 2.5 })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    price_per_unit?: number;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    delivery_available?: boolean;

    @ApiPropertyOptional({ example: '2025-12-31' })
    @IsOptional()
    @IsDateString()
    available_until?: string;

    @ApiPropertyOptional({ example: false })
    @IsOptional()
    @IsBoolean()
    is_recurring?: boolean;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;

    @ApiPropertyOptional({ example: 'uuid-here', description: 'Change the listing location' })
    @IsOptional()
    @IsString()
    location_id?: string;
}
