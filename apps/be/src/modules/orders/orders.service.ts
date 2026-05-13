import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { calculateOrderTotal } from '../../common/utils/calculateOrderTotal.util';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UpdateOrderStatusDto } from './dto/updateOrderStatus.dto';

@Injectable()
export class OrdersService {
    constructor(private readonly prisma: PrismaService) {}

    async createOrder(companyId: string, dto: CreateOrderDto) {
        const listing = await this.prisma.listing.findUnique({
            where: { id: dto.listing_id },
            select: {
                company_id: true,
                is_active: true,
                price_per_unit: true,
                unit: true,
                min_order: true,
            },
        });

        if (!listing) {
            throw new NotFoundException('Listing not found');
        }

        if (!listing.is_active) {
            throw new BadRequestException('Listing is not active');
        }

        if (dto.quantity < listing.min_order.toNumber()) {
            throw new BadRequestException('Quantity is below minimum order');
        }

        const price_per_unit = Number(listing.price_per_unit);

        const { platform_fee, total } = calculateOrderTotal({
            quantity: dto.quantity,
            price_per_unit,
        });

        return this.prisma.order.create({
            data: {
                listing_id: dto.listing_id,
                buyer_company_id: companyId,
                seller_company_id: listing.company_id,

                pickup_slot_id: dto.pickup_slot_id,
                pickup_location_id: dto.pickup_location_id,
                destination_id: dto.destination_id,

                quantity: dto.quantity,

                unit: listing.unit,

                price_per_unit,

                platform_fee,
                total,

                pickup_method: dto.pickup_method,

                status: 'waiting',

                qr_code: crypto.randomUUID(),
                co2_saved_kg: 0,
            },
            include: {
                listing: true,
                buyer_company: true,
                seller_company: true,
            },
        });
    }

    async getMyOrders(companyId: string) {
        return this.prisma.order.findMany({
            where: {
                OR: [{ buyer_company_id: companyId }, { seller_company_id: companyId }],
            },
            include: {
                listing: {
                    select: {
                        title: true,
                    },
                },
                buyer_company: true,
                seller_company: true,
            },
            orderBy: {
                created_at: 'desc',
            },
        });
    }

    async getOrderById(orderId: string, companyId: string) {
        const order = await this.prisma.order.findFirst({
            where: {
                id: orderId,
                OR: [{ buyer_company_id: companyId }, { seller_company_id: companyId }],
            },
            include: {
                listing: true,
                buyer_company: true,
                seller_company: true,
                pickup_slot: true,
                pickup_location: true,
                destination: true,
            },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return order;
    }

    async updateOrderStatus(orderId: string, companyId: string, dto: UpdateOrderStatusDto) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            select: {
                seller_company_id: true,
                status: true,
            },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (order.seller_company_id !== companyId) {
            throw new ForbiddenException('You cannot update this order');
        }

        if (order.status === dto.status) {
            throw new BadRequestException('Order is already in this status');
        }

        return this.prisma.order.update({
            where: { id: orderId },
            data: {
                status: dto.status,
            },
        });
    }
}
