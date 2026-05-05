import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateListingDto } from './dto/createListing.dto';

@Injectable()
export class ListingsService {
    constructor(private readonly prisma: PrismaService) { }

    async createListing(companyId: string, dto: CreateListingDto) {
        return await this.prisma.listing.create({
            data: {
                company_id: companyId,
                location_id: dto.location_id,
                title: dto.title,
                description: dto.description,
                material_type: dto.material_type,
                condition: dto.condition,
                listing_category: dto.listing_category,
                isReusable: dto.isReusable,
                quantity: dto.quantity,
                unit: dto.unit,
                min_order: dto.min_order,
                price_per_unit: dto.price_per_unit,
                currency: dto.currency,
                delivery_available: dto.delivery_available,
                available_until: new Date(dto.available_until),
                is_recurring: dto.is_recurring,
                images: {
                    create: dto.images,
                },
                pickup_slots: dto.pickup_slots ? {
                    create: dto.pickup_slots.map(slot => ({
                        ...slot,
                        date: new Date(slot.date),
                    })),
                } : undefined,
                recurring_schedules: dto.recurring_schedule ? {
                    create: dto.recurring_schedule,
                } : undefined,
            },
            include: {
                images: true,
                pickup_slots: true,
                recurring_schedules: true,
            },
        });
    }


}
