import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, IsEmail, Length } from 'class-validator';

export class UpdateMyProfileDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @Length(11, 11, { message: 'OIB must be exactly 11 characters' })
    oib?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @Length(1, 20)
    mbs?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @Length(1, 20)
    password?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUrl()
    logo_url?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUrl()
    website?: string;
}