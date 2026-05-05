
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetMyProfileDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    oib: string;

    @ApiProperty()
    mbs: string;

    @ApiPropertyOptional()
    logo_url?: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    email: string;

    @ApiPropertyOptional()
    website?: string;

    @ApiProperty()
    is_verified: boolean;

    @ApiPropertyOptional()
    trust_score?: number;

    @ApiPropertyOptional()
    carbon_credit?: number;

    @ApiProperty()
    created_at: Date;

    @ApiProperty()
    updated_at: Date;
}