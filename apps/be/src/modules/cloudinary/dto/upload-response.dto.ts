import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
    @ApiProperty({ example: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' })
    url: string;

    @ApiProperty({ example: 'sample' })
    public_id: string;
}
