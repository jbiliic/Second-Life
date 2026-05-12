import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class UpdateLogoDto {
    @ApiProperty({ example: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' })
    @IsNotEmpty()
    @IsUrl()
    logo_url: string;
}
