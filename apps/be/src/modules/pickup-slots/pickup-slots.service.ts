import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreatePickupSlotDto } from './dto/createPickupSlot.dto';

@Injectable()
export class PickupSlotsService {
    constructor(private readonly prisma: PrismaService) {}

    async getPickupSlots(listingId: string) {
        const exists = await this.prisma.listing.count({
            where: { id: listingId },
        });

        if (!exists) throw new NotFoundException('Listing not found');

        return this.prisma.pickupSlot.findMany({
            where: {
                listing_id: listingId,
                is_available: true,
            },
            orderBy: {
                date: 'asc',
            },
        });
    }

    async createPickupSlot(listingId: string, companyId: string, dto: CreatePickupSlotDto) {
        const listing = await this.prisma.listing.findUnique({
            where: { id: listingId },
            select: {
                id: true,
                company_id: true,
            },
        });

        if (!listing) {
            throw new NotFoundException('Listing not found');
        }

        if (listing.company_id !== companyId) {
            throw new ForbiddenException('You cannot modify this listing');
        }

        if (dto.end_time <= dto.start_time) {
            throw new BadRequestException('End time must be after start time');
        }

        return this.prisma.pickupSlot.create({
            data: {
                listing_id: listingId,
                date: new Date(dto.date + 'T00:00:00Z'),
                start_time: dto.start_time,
                end_time: dto.end_time,
                is_available: true,
            },
        });
    }
}
