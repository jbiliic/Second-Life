import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { LocationDto } from './dto/location.dto';
import { UpdateMyProfileDto } from './dto/UpdateMyProfile.dto';
import { PaymentMethodDto } from './dto/payment.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class CompaniesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cloudinary: CloudinaryService,
    ) {}

    async getProfile(id: string) {
        return await this.prisma.company.findUnique({
            where: { id },
            select: {
                name: true,
                oib: true,
                logo_url: true,
                email: true,
                is_verified: true,
            },
        });
    }

    async updateProfile(id: string, data: UpdateMyProfileDto) {
        try {
            return await this.prisma.company.update({ where: { id }, data });
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                const field = (error.meta?.target as string[])?.[0];
                throw new ConflictException(`${field} already in use`);
            }
            throw error;
        }
    }

    async createAndAddLocation(companyId: string, locationData: Omit<LocationDto, 'id'>) {
        const location = await this.prisma.location.create({
            data: {
                ...locationData,
                companies: { connect: { id: companyId } },
            },
        });
        return location;
    }

    async getLocations(companyId: string) {
        const locations = await this.prisma.location.findMany({
            include: {
                companies: {
                    where: {
                        id: companyId,
                    },
                },
            },
        });
        return locations.map((loc) => ({
            id: loc.id,
            street: loc.street,
            street_number: loc.street_number,
            city: loc.city,
            zip: loc.zip,
            country: loc.country,
            latitude: Number(loc.latitude),
            longitude: Number(loc.longitude),
        })) as LocationDto[];
    }

    async createAndAddPayment(companyId: string, paymentData: Omit<PaymentMethodDto, 'id'>) {
        const paymentMethod = await this.prisma.companyPaymentMethod.create({
            data: {
                ...paymentData,
                company: { connect: { id: companyId } },
            },
        });
        return paymentMethod;
    }

    async getPaymentMethods(companyId: string): Promise<PaymentMethodDto[]> {
        const methods = (await this.prisma.companyPaymentMethod.findMany({
            where: {
                company_id: companyId,
            },
        })) as PaymentMethodDto[];

        return methods.map((m) => ({
            id: m.id,
            is_default: m.is_default,
            iban: m.iban,
            bank_name: m.bank_name,
        }));
    }

    async updateLogo(companyId: string, file: Express.Multer.File) {
        if (!file) {
            throw new ConflictException('File is required');
        }

        const logo_url = await this.cloudinary.uploadImage(file);

        if (!logo_url) {
            throw new ConflictException('Failed to upload image');
        }

        return await this.prisma.company.update({
            where: { id: companyId },
            data: { logo_url },
            select: { logo_url: true },
        });
    }

    async getCO2Saved(companyId: string) {
        const fromDate = new Date();
        fromDate.setMonth(fromDate.getMonth() - 3);

        const res = await this.prisma.order.aggregate({
            where: {
                seller_company_id: companyId,
                created_at: { gte: fromDate },
            },
            _sum: { co2_saved_kg: true },
        });

        return { co2_saved_kg: Number(res._sum.co2_saved_kg ?? 0) };
    }

    async getActiveListingsCount(companyId: string) {
        const count = await this.prisma.listing.count({
            where: {
                company_id: companyId,
                is_active: true,
            },
        });

        return { active_listings: count };
    }

    async getProfitLast30Days(companyId: string) {
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 30);

        const res = await this.prisma.order.aggregate({
            where: {
                seller_company_id: companyId,
                created_at: { gte: fromDate },
            },
            _sum: { total: true },
        });

        return { profit_last_30_days: Number(res._sum.total ?? 0) };
    }
}
