import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
    private readonly uploadPreset: string;
    private readonly cloudName: string;

    constructor(private readonly config: ConfigService) {
        this.uploadPreset = this.config.get<string>('CLOUDINARY_UPLOAD_PRESET') ?? '';
        this.cloudName = this.config.get<string>('CLOUDINARY_CLOUD_NAME') ?? '';

        if (!this.uploadPreset || !this.cloudName) {
            throw new Error('Missing Cloudinary configuration');
        }

        cloudinary.config({
            cloud_name: this.cloudName,
        });
    }

    async uploadImage(file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('File is required');
        }

        const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

        const result = await cloudinary.uploader.unsigned_upload(dataUrl, this.uploadPreset, {
            resource_type: 'image',
        });

        return result.secure_url;
    }
}
