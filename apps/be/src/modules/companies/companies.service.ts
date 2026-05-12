import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { LocationDto } from './dto/location.dto';
import { UpdateMyProfileDto } from './dto/UpdateMyProfile.dto';

@Injectable()
export class CompaniesService {
    constructor(private readonly prisma: PrismaService) {}

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
}
