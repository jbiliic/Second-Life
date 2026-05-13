import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

export class GetMyListingsQueryDto {
    @ApiPropertyOptional({
        enum: ['active', 'expired', 'all', 'aktivno', 'sve'],
        description: 'Filter listings by status. Accepts HR aliases aktivno/sve.',
    })
    @IsOptional()
    @IsIn(['active', 'expired', 'all', 'aktivno', 'sve'])
    status?: string;
}

export class MyListingCardDto {
    @ApiProperty({ example: 'uuid-here' })
    id: string;

    @ApiProperty({ example: 'EUR pallets - 120x80cm, good condition' })
    title: string;

    @ApiProperty({ example: 500 })
    quantity: number;

    @ApiProperty({ example: 'kom' })
    unit: string;

    @ApiProperty({ example: 'Zagreb' })
    location: string;

    @ApiProperty({ example: 3.2 })
    distanceKm: number;

    @ApiProperty({ example: '13.05.2026.' })
    expiresAt: string;

    @ApiProperty({ example: 2.5 })
    pricePerUnit: number;

    @ApiProperty({ example: '/secondlife.svg' })
    imageUrl?: string;
}
