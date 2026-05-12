import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    Length,
    MinLength,
    Matches,
    IsNotEmpty,
    IsLongitude,
    IsLatitude,
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

    @ApiProperty({ example: 45.815 })
    @IsLatitude()
    latitude: number;

    @ApiProperty({ example: 15.9819 })
    @IsLongitude()
    longitude: number;
}
export class RegisterCompanyDto {
    @ApiProperty({ example: 'Acme d.o.o.' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: '12345678901', description: 'Croatian OIB (11 digits)' })
    @IsString()
    @IsNotEmpty()
    @Length(11, 11)
    oib: string;

    @ApiPropertyOptional({ example: 'https://cdn.example.com/logo.png' })
    @IsOptional()
    @IsUrl()
    logo_url?: string;

    @ApiProperty({ example: 'SuperSecret123!' })
    @IsString()
    @MinLength(8)
    password: string;

    @ApiProperty({ example: 'info@acme.hr' })
    @IsEmail()
    email: string;

    @ApiPropertyOptional()
    @IsOptional()
    location?: LocationDto;
}
