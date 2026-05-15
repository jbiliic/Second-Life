import { ApiProperty } from '@nestjs/swagger';
import { PickupMethod } from '@prisma/client';
import { IsEnum, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateOrderDto {
    @ApiProperty()
    @IsUUID()
    listing_id: string;

    @ApiProperty()
    @IsUUID()
    pickup_slot_id: string;

    @ApiProperty()
    @IsUUID()
    pickup_location_id: string;

    @ApiProperty()
    @IsUUID()
    destination_id: string;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    quantity: number;

    @ApiProperty({ enum: PickupMethod })
    @IsEnum(PickupMethod)
    pickup_method: PickupMethod;
}
