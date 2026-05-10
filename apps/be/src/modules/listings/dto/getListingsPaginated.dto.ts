// dto/listing-list-item.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MaterialType, MaterialCondition, UnitType } from '@prisma/client';

export class ListingListItemDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    city: string;

    @ApiProperty()
    company_name: string;

    @ApiPropertyOptional()
    cover_image_url: string | null;

    @ApiProperty({ enum: MaterialType })
    material_type: MaterialType;

    @ApiProperty({ enum: MaterialCondition })
    condition: MaterialCondition;

    @ApiProperty({ enum: UnitType })
    unit: UnitType;

    @ApiProperty()
    price_per_unit: number;

    @ApiProperty()
    currency: string;

    @ApiPropertyOptional()
    distance_km: number | null;
}

export class PaginatedListingsDto {
    @ApiProperty({ type: [ListingListItemDto] })
    data: ListingListItemDto[];

    @ApiProperty()
    page: number;

    @ApiProperty()
    total: number;

    @ApiProperty()
    total_pages: number;

    @ApiPropertyOptional()
    next: number | null;

    @ApiPropertyOptional()
    prev: number | null;
}