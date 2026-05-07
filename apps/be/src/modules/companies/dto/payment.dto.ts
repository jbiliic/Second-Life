import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentType } from '@prisma/client';
import {
    IsBoolean,
    IsEnum,
    IsIBAN,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    Matches,
} from 'class-validator';

export class PaymentMethodDto {
    @ApiPropertyOptional({ example: 'uuid-here' })
    @IsOptional()
    @IsUUID()
    id?: string;

    @ApiProperty({ enum: PaymentType, example: PaymentType.bank_transfer })
    @IsEnum(PaymentType)
    type: PaymentType;

    @ApiProperty({ example: true, description: 'Whether this is the default payment method' })
    @IsBoolean()
    is_default: boolean;

    @ApiProperty({ example: 'HR1210010051863000160' })
    @IsNotEmpty()
    @IsString()
    @IsIBAN()
    iban: string;

    @ApiProperty({ example: 'Hrvatska poštanska banka' })
    @IsNotEmpty()
    @IsString()
    bank_name: string;
}
