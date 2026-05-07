import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UpdateMyProfileDto } from './dto/UpdateMyProfile.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { LocationDto } from './dto/location.dto';
import { PaymentMethodDto } from './dto/payment.dto';

@Injectable()
export class CompaniesService {
    constructor(private readonly prisma: PrismaService) {}

    async getProfile(id: string) {
        return await this.prisma.company.findUnique({
            where: { id },
            select: {
                name: true,
                oib: true,
                mbs: true,
                logo_url: true,
                phone: true,
                email: true,
                website: true,
                is_verified: true,
                trust_score: true,
                carbon_credit: true,
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
                company: { connect: { id: companyId } },
            },
        });
        return location;
    }

    async getLocations(companyId: string) {
        return await this.prisma.location.findMany({
            include: {
                companies: {
                    where: {
                        id: companyId,
                    },
                },
            },
        });
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
            type: m.type,
            is_default: m.is_default,
            iban: m.iban,
            bank_name: m.bank_name,
        }));
    }
}
