import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateListingDto } from './dto/createListing.dto';
import { GetListingsQueryDto } from './dto/getListingQuery.dto';
import { calculateDistance } from '../../common/utils/calculateDistance.util';
import { PaginatedListingsDto } from './dto/getListingsPaginated.dto';

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

    async getListingsPaginated(query: GetListingsQueryDto): Promise<PaginatedListingsDto> {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;

        const where: any = {
            is_active: true,
            ...(query.material_type && { material_type: query.material_type }),
            ...(query.condition && { condition: query.condition }),
            ...(query.listing_category && { listing_category: query.listing_category }),
            ...(query.unit && { unit: query.unit }),
            ...(query.isReusable !== undefined && { isReusable: query.isReusable }),
            ...(query.delivery_available !== undefined && { delivery_available: query.delivery_available }),
            ...((query.min_price !== undefined || query.max_price !== undefined) && {
                price_per_unit: {
                    ...(query.min_price !== undefined && { gte: query.min_price }),
                    ...(query.max_price !== undefined && { lte: query.max_price }),
                },
            }),
            ...(query.min_quantity !== undefined && { quantity: { gte: query.min_quantity } }),
        };

        const orderBy: any = query.sort_by && query.sort_by !== 'distance'
            ? { [query.sort_by === 'price' ? 'price_per_unit' : query.sort_by]: query.sort_order ?? 'desc' }
            : { created_at: 'desc' };

        const [total, listings] = await this.prisma.$transaction([
            this.prisma.listing.count({ where }),
            this.prisma.listing.findMany({
                where,
                orderBy,
                skip,
                take: limit,
                include: {
                    images: { where: { is_primary: true }, take: 1 },
                    location: true,
                    company: {
                        select: {
                            name: true,
                        },
                    },
                },
            }),
        ]);

        let result = listings.map(listing => ({
            id: listing.id,
            title: listing.title,
            city: listing.location.city,
            company_name: listing.company.name,
            cover_image_url: listing.images[0]?.image_url ?? null,
            material_type: listing.material_type,
            condition: listing.condition,
            unit: listing.unit,
            price_per_unit: Number(listing.price_per_unit),
            currency: listing.currency,
            distance_km: query.lat && query.lng
                ? calculateDistance(
                    query.lat,
                    query.lng,
                    Number(listing.location.latitude),
                    Number(listing.location.longitude),
                )
                : null,
        }));

        if (query.lat && query.lng && query.max_distance_km) {
            result = result.filter(l => l.distance_km! <= query.max_distance_km!);
        }

        if (query.sort_by === 'distance' && query.lat && query.lng) {
            result = result.sort((a, b) => (a.distance_km ?? 0) - (b.distance_km ?? 0));
        }

        const total_pages = Math.ceil(total / limit);

        return {
            data: result,
            page,
            total,
            total_pages,
            next: page < total_pages ? page + 1 : null,
            prev: page > 1 ? page - 1 : null,
        };
    }


}
