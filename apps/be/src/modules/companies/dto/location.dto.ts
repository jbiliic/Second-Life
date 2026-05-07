import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsLatitude,
    IsLongitude,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';

export class LocationDto {
    @ApiPropertyOptional({ example: 'uuid-here' })
    @IsOptional()
    @IsUUID()
    id?: string;

    @ApiProperty({ example: 'Croatia' })
    @IsNotEmpty()
    @IsString()
    country: string;

    @ApiProperty({ example: 'Zagreb' })
    @IsNotEmpty()
    @IsString()
    city: string;

    @ApiProperty({ example: '10000' })
    @IsNotEmpty()
    @IsString()
    zip: string;

    @ApiProperty({ example: 'Ilica' })
    @IsNotEmpty()
    @IsString()
    street: string;

    @ApiProperty({ example: '42' })
    @IsNotEmpty()
    @IsString()
    street_number: string;

    @ApiProperty({ example: 45.8150 })
    @IsLatitude()
    latitude: number;

    @ApiProperty({ example: 15.9819 })
    @IsLongitude()
    longitude: number;
}