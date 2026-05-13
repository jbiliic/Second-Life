import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MaterialCondition, UnitType } from '@prisma/client';

export class HomePageListingCardDto {
    @ApiProperty()
    name: string;

    @ApiProperty({ enum: MaterialCondition })
    material_condition: MaterialCondition;

    @ApiProperty()
    quantity: number;

    @ApiProperty({ enum: UnitType })
    unit: UnitType;

    @ApiProperty()
    price_per_unit: number;

    @ApiProperty()
    is_available: boolean;

    @ApiPropertyOptional()
    image_url: string | null;
}
