import { Controller, Post, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserGuard } from '../../common/auth/guards/user.guard';
import { CloudinaryService } from './cloudinary.service';
import { UploadResponseDto } from './dto/upload-response.dto';

@ApiTags('Cloudinary')
@ApiBearerAuth()
@UseGuards(UserGuard)
@Controller('/cloudinary')
export class CloudinaryController {
    constructor(private readonly cloudinaryService: CloudinaryService) {}

    @Post('/upload')
    @ApiBearerAuth()
    @UseGuards(UserGuard)
    @ApiOperation({ summary: 'Upload image to Cloudinary' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' },
            },
            required: ['file'],
        },
    })
    @ApiResponse({ status: 201, type: UploadResponseDto })
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<UploadResponseDto> {
        return this.cloudinaryService.uploadImage(file);
    }
}
