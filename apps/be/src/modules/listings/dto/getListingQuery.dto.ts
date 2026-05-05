import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsEnum, IsBoolean, IsInt, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { MaterialType, MaterialCondition, ListingCategory, UnitType } from '@prisma/client';

export class GetListingsQueryDto {
    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page?: number = 1;

    @ApiPropertyOptional({ example: 10 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    limit?: number = 10;

    @ApiPropertyOptional({ example: 45.815 })
    @IsOptional()
    @IsNumber()
    @Min(-90)
    @Max(90)
    @Type(() => Number)
    lat?: number;

    @ApiPropertyOptional({ example: 15.9819 })
    @IsOptional()
    @IsNumber()
    @Min(-180)
    @Max(180)
    @Type(() => Number)
    lng?: number;

    @ApiPropertyOptional({ example: 50, description: 'Max distance in km' })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    max_distance_km?: number;

    @ApiPropertyOptional({ enum: MaterialType })
    @IsOptional()
    @IsEnum(MaterialType)
    material_type?: MaterialType;

    @ApiPropertyOptional({ enum: MaterialCondition })
    @IsOptional()
    @IsEnum(MaterialCondition)
    condition?: MaterialCondition;

    @ApiPropertyOptional({ enum: ListingCategory })
    @IsOptional()
    @IsEnum(ListingCategory)
    listing_category?: ListingCategory;

    @ApiPropertyOptional({ enum: UnitType })
    @IsOptional()
    @IsEnum(UnitType)
    unit?: UnitType;

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    isReusable?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    delivery_available?: boolean;


    @ApiPropertyOptional({ example: 100, description: 'Max price per unit' })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    max_price?: number;

    @ApiPropertyOptional({ example: 0, description: 'Min price per unit' })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    min_price?: number;

    @ApiPropertyOptional({ example: 10, description: 'Min quantity available' })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    min_quantity?: number;

    @ApiPropertyOptional({ enum: ['price', 'quantity', 'created_at', 'distance'] })
    @IsOptional()
    sort_by?: 'price' | 'quantity' | 'created_at' | 'distance';

    @ApiPropertyOptional({ enum: ['asc', 'desc'] })
    @IsOptional()
    sort_order?: 'asc' | 'desc' = 'desc';
}