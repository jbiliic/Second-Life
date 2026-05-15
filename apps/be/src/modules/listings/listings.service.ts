import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { calculateDistance } from '../../common/utils/calculateDistance.util';
import { CronRelistService } from '../cronRelist/cronRelist.service';
import { CreateListingDto } from './dto/createListing.dto';
import { GetListingsQueryDto } from './dto/getListingQuery.dto';
import { PaginatedListingsDto } from './dto/getListingsPaginated.dto';
import { GetListingDto } from './dto/getSingleListing.dto';
import { UpdateListingDto } from './dto/updateListing.dto';
import { formatDateHr } from '../../common/utils/formatDate';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ListingsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cronRelistService: CronRelistService,
        private readonly cloudinary: CloudinaryService,
    ) {}

    async createListing(companyId: string, dto: CreateListingDto, files: Express.Multer.File[]) {
        const imageUrls = await this.cloudinary.uploadImages(files);

        const images = imageUrls.map((url, index) => ({
            image_url: url,
            is_primary: index === 0,
            sort_order: index,
        }));

        const listing = await this.prisma.listing.create({
            data: {
                company_id: companyId,
                location_id: dto.location_id,
                title: dto.title,
                description: dto.description,
                material_type: dto.material_type,
                condition: dto.condition,
                listing_category: dto.listing_category,
                quantity: dto.quantity,
                unit: dto.unit,
                min_order: dto.min_order,
                price_per_unit: dto.price_per_unit,
                delivery_available: dto.delivery_available,
                available_until: new Date(dto.available_until),
                is_recurring: dto.is_recurring,
                images: { create: images },
                pickup_slots: dto.pickup_slots
                    ? {
                          create: dto.pickup_slots.map((slot) => ({
                              ...slot,
                              date: new Date(slot.date),
                          })),
                      }
                    : undefined,
                recurring_schedules: dto.recurring_schedule
                    ? {
                          create: {
                              ...dto.recurring_schedule,
                              start_date: new Date(dto.recurring_schedule.start_date),
                              end_date: new Date(dto.recurring_schedule.end_date),
                          },
                      }
                    : undefined,
            },
            include: {
                images: true,
                pickup_slots: true,
                recurring_schedules: true,
            },
        });

        if (listing.is_recurring && listing.recurring_schedules.length > 0) {
            await this.cronRelistService.registerCronJob(listing.recurring_schedules[0].id);
        }

        return listing;
    }

    async getHomePageListings(companyId: string) {
        const listings = await this.prisma.listing.findMany({
            where: { company_id: companyId },
            orderBy: { created_at: 'desc' },
            take: 3,
            include: {
                images: { where: { is_primary: true }, take: 1 },
            },
        });

        return listings.map((listing) => ({
            id: listing.id,
            name: listing.title,
            material_condition: listing.condition,
            quantity: Number(listing.quantity),
            unit: listing.unit,
            price_per_unit: Number(listing.price_per_unit),
            is_available: listing.is_active,
            image_url: listing.images[0]?.image_url ?? null,
        }));
    }

    async getMyListings(companyId: string, status?: string) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const where: any = {
            company_id: companyId,
        };

        if (status === 'active') {
            where.is_active = true;
            where.available_until = { gte: today };
        }

        if (status === 'expired') {
            where.OR = [{ is_active: false }, { available_until: { lt: today } }];
        }

        const [defaultLocation, listings] = await this.prisma.$transaction([
            this.prisma.location.findFirst({
                where: { companies: { some: { id: companyId } } },
                orderBy: { created_at: 'asc' },
                select: { latitude: true, longitude: true },
            }),
            this.prisma.listing.findMany({
                where,
                orderBy: { created_at: 'desc' },
                include: {
                    images: { where: { is_primary: true }, take: 1 },
                    location: true,
                },
            }),
        ]);

        const baseLat = defaultLocation ? Number(defaultLocation.latitude) : null;
        const baseLng = defaultLocation ? Number(defaultLocation.longitude) : null;

        return listings.map((listing) => ({
            id: listing.id,
            title: listing.title,
            quantity: Number(listing.quantity),
            unit: listing.unit,
            location: listing.location.city,
            distanceKm:
                baseLat !== null && baseLng !== null
                    ? calculateDistance(
                          baseLat,
                          baseLng,
                          Number(listing.location.latitude),
                          Number(listing.location.longitude),
                      )
                    : 0,
            expiresAt: formatDateHr(listing.available_until),
            pricePerUnit: Number(listing.price_per_unit),
            imageUrl: listing.images[0]?.image_url ?? null,
        }));
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
            ...(query.delivery_available !== undefined && {
                delivery_available: query.delivery_available,
            }),
            ...((query.min_price !== undefined || query.max_price !== undefined) && {
                price_per_unit: {
                    ...(query.min_price !== undefined && { gte: query.min_price }),
                    ...(query.max_price !== undefined && { lte: query.max_price }),
                },
            }),
            ...(query.min_quantity !== undefined && {
                quantity: { gte: query.min_quantity },
            }),
        };

        const orderBy: any =
            query.sort_by && query.sort_by !== 'distance'
                ? {
                      [query.sort_by === 'price' ? 'price_per_unit' : query.sort_by]:
                          query.sort_order ?? 'desc',
                  }
                : { created_at: 'desc' };

        const needsDistanceProcessing = !!(
            query.lat &&
            query.lng &&
            (query.max_distance_km || query.sort_by === 'distance')
        );

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

            let withDistance = slim.map((l) => ({
                id: l.id,
                distance_km: calculateDistance(
                    query.lat!,
                    query.lng!,
                    Number(l.location.latitude),
                    Number(l.location.longitude),
                ),
            }));

            if (query.max_distance_km) {
                withDistance = withDistance.filter((l) => l.distance_km <= query.max_distance_km!);
            }

            if (query.sort_by === 'distance') {
                withDistance.sort((a, b) => a.distance_km - b.distance_km);
            }

            const total = withDistance.length;
            const total_pages = Math.ceil(total / limit);
            const pageIds = withDistance.slice(skip, skip + limit);

            if (pageIds.length === 0) {
                return {
                    data: [],
                    page,
                    total,
                    total_pages,
                    next: null,
                    prev: page > 1 ? page - 1 : null,
                };
            }

            const distanceMap = new Map(pageIds.map((l) => [l.id, l.distance_km]));

            const listings = await this.prisma.listing.findMany({
                where: { id: { in: pageIds.map((l) => l.id) } },
                include: {
                    images: { where: { is_primary: true }, take: 1 },
                    location: true,
                    company: { select: { name: true } },
                },
            });

            const sorted = pageIds
                .map(({ id }) => listings.find((l) => l.id === id)!)
                .filter(Boolean);

            return {
                data: sorted.map((listing) => ({
                    id: listing.id,
                    title: listing.title,
                    city: listing.location.city,
                    company_name: listing.company.name,
                    cover_image_url: listing.images[0]?.image_url ?? null,
                    material_type: listing.material_type,
                    condition: listing.condition,
                    unit: listing.unit,
                    price_per_unit: Number(listing.price_per_unit),
                    distance_km: distanceMap.get(listing.id) ?? null,
                })),
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

        return {
            data: listings.map((listing) => ({
                id: listing.id,
                title: listing.title,
                city: listing.location.city,
                company_name: listing.company.name,
                cover_image_url: listing.images[0]?.image_url ?? null,
                material_type: listing.material_type,
                condition: listing.condition,
                unit: listing.unit,
                price_per_unit: Number(listing.price_per_unit),
                distance_km:
                    query.lat && query.lng
                        ? calculateDistance(
                              query.lat,
                              query.lng,
                              Number(listing.location.latitude),
                              Number(listing.location.longitude),
                          )
                        : null,
            })),
            page,
            total,
            total_pages: Math.ceil(total / limit),
            next: page < Math.ceil(total / limit) ? page + 1 : null,
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
            this.prisma.listing.delete({ where: { id } }),
        ]);
    }

    async getListingById(id: string, lat?: number, lng?: number): Promise<GetListingDto> {
        const listing = await this.prisma.listing.findUniqueOrThrow({
            where: { id },
            include: {
                images: { orderBy: { sort_order: 'asc' } },
                location: true,
                company: {
                    select: {
                        id: true,
                        name: true,
                        logo_url: true,
                    },
                },
            },
        });

        return {
            id: listing.id,
            title: listing.title,
            description: listing.description,
            material_type: listing.material_type,
            condition: listing.condition,
            listing_category: listing.listing_category,
            quantity: Number(listing.quantity),
            unit: listing.unit,
            min_order: Number(listing.min_order),
            price_per_unit: Number(listing.price_per_unit),
            delivery_available: listing.delivery_available,
            available_until: listing.available_until.toISOString(),
            is_recurring: listing.is_recurring,
            is_active: listing.is_active,
            created_at: listing.created_at.toISOString(),
            company: {
                id: listing.company.id,
                name: listing.company.name,
                logo_url: listing.company.logo_url ?? null,
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
            images: listing.images.map((img) => ({
                id: img.id,
                image_url: img.image_url,
                is_primary: img.is_primary,
                sort_order: img.sort_order,
            })),
            distance_km:
                lat && lng
                    ? calculateDistance(
                          lat,
                          lng,
                          Number(listing.location.latitude),
                          Number(listing.location.longitude),
                      )
                    : null,
        };
    }

    async updateListing(id: string, companyId: string, dto: UpdateListingDto) {
        const existing = await this.prisma.listing.findUniqueOrThrow({
            where: { id },
            select: { company_id: true },
        });

        if (existing.company_id !== companyId) {
            throw new ForbiddenException('You do not own this listing');
        }

        const updatedListing = await this.prisma.listing.update({
            where: { id },
            data: {
                ...dto,
                ...(dto.available_until && {
                    available_until: new Date(dto.available_until),
                }),
            },
        });

        const schedule = await this.prisma.recurringSchedule.findFirst({
            where: { listing_id: id },
        });

        if (updatedListing.is_recurring && schedule) {
            await this.cronRelistService.registerCronJob(schedule.id);
        } else if (!updatedListing.is_recurring && schedule) {
            await this.cronRelistService.removeSchedule(schedule.id);
        }

        return this.getListingById(id);
    }
}
