import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateListingDto } from './dto/createListing.dto';
import { GetListingsQueryDto } from './dto/getListingQuery.dto';
import { calculateDistance } from '../../common/utils/calculateDistance.util';
import { PaginatedListingsDto } from './dto/getListingsPaginated.dto';
import { GetListingDto } from './dto/getSingleListing.dto';
import { UpdateListingDto } from './dto/updateListing.dto';

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
    /*
    TODO: ucinit ovu funkciju manje groznom
    */
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

        const needsDistanceProcessing = !!(query.lat && query.lng && (query.max_distance_km || query.sort_by === 'distance'));

        if (needsDistanceProcessing) {
            const slim = await this.prisma.listing.findMany({
                where,
                select: {
                    id: true,
                    location: {
                        select: {
                            latitude: true,
                            longitude: true,
                        },
                    },
                },
            });

            let withDistance = slim.map(l => ({
                id: l.id,
                distance_km: calculateDistance(
                    query.lat!,
                    query.lng!,
                    Number(l.location.latitude),
                    Number(l.location.longitude),
                ),
            }));

            if (query.max_distance_km) {
                withDistance = withDistance.filter(l => l.distance_km <= query.max_distance_km!);
            }

            if (query.sort_by === 'distance') {
                withDistance.sort((a, b) => a.distance_km - b.distance_km);
            }

            const total = withDistance.length;
            const total_pages = Math.ceil(total / limit);
            const pageIds = withDistance.slice(skip, skip + limit);

            if (pageIds.length === 0) {
                return { data: [], page, total, total_pages, next: null, prev: page > 1 ? page - 1 : null };
            }

            const distanceMap = new Map(pageIds.map(l => [l.id, l.distance_km]));
            const listings = await this.prisma.listing.findMany({
                where: { id: { in: pageIds.map(l => l.id) } },
                include: {
                    images: { where: { is_primary: true }, take: 1 },
                    location: true,
                    company: { select: { name: true } },
                },
            });

            const sorted = pageIds
                .map(({ id }) => listings.find(l => l.id === id)!)
                .filter(Boolean);

            const data = sorted.map(listing => ({
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
                distance_km: distanceMap.get(listing.id) ?? null,
            }));

            return {
                data,
                page,
                total,
                total_pages,
                next: page < total_pages ? page + 1 : null,
                prev: page > 1 ? page - 1 : null,
            };
        }

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
                    company: { select: { name: true } },
                },
            }),
        ]);

        const data = listings.map(listing => ({
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

        const total_pages = Math.ceil(total / limit);

        return {
            data,
            page,
            total,
            total_pages,
            next: page < total_pages ? page + 1 : null,
            prev: page > 1 ? page - 1 : null,
        };
    }

    async deleteListing(id: string, companyId: string): Promise<void> {
        const existing = await this.prisma.listing.findUniqueOrThrow({
            where: { id },
            select: { company_id: true },
        });

        if (existing.company_id !== companyId) {
            throw new ForbiddenException('You do not own this listing');
        }

        await this.prisma.$transaction([
            this.prisma.listingImage.deleteMany({ where: { listing_id: id } }),
            this.prisma.pickupSlot.deleteMany({ where: { listing_id: id } }),
            this.prisma.recurringSchedule.deleteMany({ where: { listing_id: id } }),
            this.prisma.savedListing.deleteMany({ where: { listing_id: id } }),
            this.prisma.notification.deleteMany({ where: { listing_id: id } }),
            this.prisma.listing.delete({ where: { id } }),
        ]);
    }

    async getListingById(id: string, requestingCompanyId?: string, lat?: number, lng?: number): Promise<GetListingDto> {
        const listing = await this.prisma.listing.findUniqueOrThrow({
            where: { id },
            include: {
                images: {
                    orderBy: { sort_order: 'asc' },
                },
                location: true,
                company: {
                    select: {
                        id: true,
                        name: true,
                        logo_url: true,
                        trust_score: true,
                    },
                },
                saved_by: requestingCompanyId
                    ? { where: { company_id: requestingCompanyId }, take: 1 }
                    : false,
            },
        });

        return {
            id: listing.id,
            title: listing.title,
            description: listing.description,
            material_type: listing.material_type,
            condition: listing.condition,
            listing_category: listing.listing_category,
            isReusable: listing.isReusable,
            quantity: Number(listing.quantity),
            unit: listing.unit,
            min_order: Number(listing.min_order),
            price_per_unit: Number(listing.price_per_unit),
            currency: listing.currency,
            delivery_available: listing.delivery_available,
            available_until: listing.available_until.toISOString(),
            is_recurring: listing.is_recurring,
            is_active: listing.is_active,
            created_at: listing.created_at.toISOString(),
            company: {
                id: listing.company.id,
                name: listing.company.name,
                logo_url: listing.company.logo_url ?? null,
                trust_score: listing.company.trust_score ? Number(listing.company.trust_score) : null,
            },
            location: {
                city: listing.location.city,
                country: listing.location.country,
                street: listing.location.street,
                street_number: listing.location.street_number,
                zip: listing.location.zip,
                latitude: Number(listing.location.latitude),
                longitude: Number(listing.location.longitude),
            },
            images: listing.images.map(img => ({
                id: img.id,
                image_url: img.image_url,
                is_primary: img.is_primary,
                sort_order: img.sort_order,
            })),
            distance_km: lat && lng
                ? calculateDistance(lat, lng, Number(listing.location.latitude), Number(listing.location.longitude))
                : null,
            is_saved: Array.isArray(listing.saved_by) ? listing.saved_by.length > 0 : false,
        };
    }

    async updateListing(id: string, companyId: string, dto: UpdateListingDto): Promise<GetListingDto> {
        const existing = await this.prisma.listing.findUniqueOrThrow({
            where: { id },
            select: { company_id: true },
        });

        if (existing.company_id !== companyId) {
            throw new ForbiddenException('You do not own this listing');
        }

        await this.prisma.listing.update({
            where: { id },
            data: {
                ...dto,
                ...(dto.available_until && { available_until: new Date(dto.available_until) }),
            },
        });
        return this.getListingById(id, companyId);
    }
}
