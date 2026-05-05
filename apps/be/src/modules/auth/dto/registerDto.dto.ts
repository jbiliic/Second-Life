import {
    IsString,
    IsEmail,
    IsOptional,
    IsUrl,
    Length,
    MinLength,
    Matches,
    IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterCompanyDto {

    @ApiProperty({ example: 'Acme d.o.o.' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({ example: '12345678901', description: 'Croatian OIB (11 digits)' })
    @IsNotEmpty()
    @IsString()
    @Length(11, 11, { message: 'OIB must be exactly 11 characters' })
    oib: string;

    @ApiPropertyOptional({ example: '080123456', description: 'MBS – up to 20 chars' })
    @IsNotEmpty()
    @IsString()
    @Length(1, 20)
    mbs: string;

    @ApiPropertyOptional({ example: 'https://cdn.example.com/logo.png' })
    @IsOptional()
    @IsUrl()
    logo_url?: string;

    @ApiProperty({ example: 'SuperSecret123!' })
    @IsString()
    @MinLength(8)
    password: string;

    @ApiProperty({ example: '+385911234567' })
    @IsString()
    phone: string;

    @ApiProperty({ example: 'info@acme.hr' })
    @IsEmail()
    email: string;

    @ApiPropertyOptional({ example: 'https://acme.hr' })
    @IsOptional()
    @IsUrl()
    website?: string;
}