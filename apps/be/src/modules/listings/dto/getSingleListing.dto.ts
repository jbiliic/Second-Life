import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ListingCategory, MaterialCondition, MaterialType, UnitType } from '@prisma/client';

class ListingCompanyDto {
    @ApiProperty({ example: 'uuid-here' })
    id: string;

    @ApiProperty({ example: 'Acme d.o.o.' })
    name: string;

    @ApiPropertyOptional({ example: 'https://cdn.example.com/logo.png' })
    logo_url: string | null;
}

class ListingLocationDto {
    @ApiProperty({ example: 'Zagreb' })
    city: string;

    @ApiProperty({ example: 'Croatia' })
    country: string;

    @ApiProperty({ example: 'Ilica' })
    street: string;

    @ApiProperty({ example: '42' })
    street_number: string;

    @ApiProperty({ example: '10000' })
    zip: string;

    @ApiProperty({ example: 45.815 })
    latitude: number;

    @ApiProperty({ example: 15.9819 })
    longitude: number;
}

class ListingImageDto {
    @ApiProperty({ example: 'uuid-here' })
    id: string;

    @ApiProperty({ example: 'https://cdn.example.com/image.jpg' })
    image_url: string;

    @ApiProperty({ example: true })
    is_primary: boolean;

    @ApiProperty({ example: 0 })
    sort_order: number;
}

export class GetListingDto {
    @ApiProperty({ example: 'uuid-here' })
    id: string;

    @ApiProperty({ example: 'EUR pallets - 120x80cm, good condition' })
    title: string;

    @ApiProperty({
        example: 'Lightly used EUR pallets, suitable for reuse. Available for pickup Mon-Fri.',
    })
    description: string;

    @ApiProperty({ enum: MaterialType, example: MaterialType.wood })
    material_type: MaterialType;

    @ApiProperty({ enum: MaterialCondition, example: MaterialCondition.B })
    condition: MaterialCondition;

    @ApiProperty({ enum: ListingCategory, example: ListingCategory.pallets })
    listing_category: ListingCategory;

    @ApiProperty({ example: 500 })
    quantity: number;

    @ApiProperty({ enum: UnitType, example: UnitType.kom })
    unit: UnitType;

    @ApiProperty({ example: 10 })
    min_order: number;

    @ApiProperty({ example: 2.5 })
    price_per_unit: number;

    @ApiProperty({ example: true })
    delivery_available: boolean;

    @ApiProperty({ example: '2025-12-31T00:00:00.000Z' })
    available_until: string;

    @ApiProperty({ example: false })
    is_recurring: boolean;

    @ApiProperty({ example: true })
    is_active: boolean;

    @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
    created_at: string;

    @ApiProperty({ type: () => ListingCompanyDto })
    company: ListingCompanyDto;

    @ApiProperty({ type: () => ListingLocationDto })
    location: ListingLocationDto;

    @ApiProperty({ type: () => ListingImageDto, isArray: true })
    images: ListingImageDto[];

    @ApiPropertyOptional({
        example: 12.4,
        nullable: true,
        description:
            'Distance in km from the requesting location. Null if no coordinates were provided.',
    })
    distance_km: number | null;
}
