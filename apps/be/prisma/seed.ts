import {
    ListingCategory,
    MaterialCondition,
    MaterialType,
    OrderStatus,
    PickupMethod,
    PrismaClient,
    UnitType,
} from '@prisma/client';

const prisma = new PrismaClient();

function randomDecimal(min: number, max: number) {
    return (Math.random() * (max - min) + min).toFixed(2);
}

async function main() {
    await prisma.rating.deleteMany();
    await prisma.order.deleteMany();
    await prisma.listingImage.deleteMany();
    await prisma.pickupSlot.deleteMany();
    await prisma.listing.deleteMany();
    await prisma.companyPaymentMethod.deleteMany();
    await prisma.location.deleteMany();
    await prisma.company.deleteMany();

    const locations = await Promise.all([
        prisma.location.create({
            data: {
                country: 'Hrvatska',
                city: 'Split',
                zip: '21000',
                street: 'Poljička cesta',
                street_number: '35',
                latitude: 43.5081,
                longitude: 16.4402,
            },
        }),
        prisma.location.create({
            data: {
                country: 'Hrvatska',
                city: 'Zagreb',
                zip: '10000',
                street: 'Ilica',
                street_number: '1',
                latitude: 45.815,
                longitude: 15.9819,
            },
        }),
        prisma.location.create({
            data: {
                country: 'Hrvatska',
                city: 'Rijeka',
                zip: '51000',
                street: 'Korzo',
                street_number: '10',
                latitude: 45.3271,
                longitude: 14.4422,
            },
        }),
        prisma.location.create({
            data: {
                country: 'Hrvatska',
                city: 'Zadar',
                zip: '23000',
                street: 'Obala kralja Petra Krešimira IV',
                street_number: '2',
                latitude: 44.1194,
                longitude: 15.2314,
            },
        }),
    ]);

    const companies = await Promise.all([
        prisma.company.create({
            data: {
                name: 'EcoMetal Split d.o.o.',
                oib: '11111111111',
                mbs: '1000000001',
                phone: '+385911111111',
                email: 'info@ecometal.hr',
                password: 'hashed',
                locations: { connect: { id: locations[0].id } },
            },
        }),
        prisma.company.create({
            data: {
                name: 'Zagrebačka Reciklaža d.o.o.',
                oib: '22222222222',
                mbs: '1000000002',
                phone: '+385922222222',
                email: 'info@reciklaza.hr',
                password: 'hashed',
                locations: { connect: { id: locations[1].id } },
            },
        }),
        prisma.company.create({
            data: {
                name: 'Adria Plast Rijeka',
                oib: '33333333333',
                mbs: '1000000003',
                phone: '+385933333333',
                email: 'info@adria-plast.hr',
                password: 'hashed',
                locations: { connect: { id: locations[2].id } },
            },
        }),
        prisma.company.create({
            data: {
                name: 'Zadarski Industrijski Otpad',
                oib: '44444444444',
                mbs: '1000000004',
                phone: '+385944444444',
                email: 'info@zadar-otpad.hr',
                password: 'hashed',
                locations: { connect: { id: locations[3].id } },
            },
        }),
    ]);

    const listings: any[] = [];

    for (let i = 0; i < companies.length; i++) {
        const company = companies[i];
        const location = locations[i];

        for (let j = 0; j < 2; j++) {
            const listing = await prisma.listing.create({
                data: {
                    company_id: company.id,
                    location_id: location.id,
                    title: `Industrijski materijal ${i + 1}-${j + 1}`,
                    description: 'Visokokvalitetan industrijski reciklabilni materijal.',
                    material_type: j % 2 === 0 ? MaterialType.metal : MaterialType.plastic,
                    condition: MaterialCondition.A,
                    listing_category: ListingCategory.other,
                    quantity: Number(randomDecimal(100, 1000)),
                    unit: UnitType.kg,
                    min_order: 50,
                    price_per_unit: Number(randomDecimal(0.5, 3)),
                    delivery_available: Math.random() > 0.5,
                    available_until: new Date('2026-12-31'),
                    is_recurring: false,
                    images: {
                        create: [
                            {
                                image_url: `https://picsum.photos/seed/${i}${j}/600/400`,
                                is_primary: true,
                                sort_order: 0,
                            },
                        ],
                    },
                },
                include: {
                    images: true,
                },
            });

            listings.push(listing);

            await prisma.pickupSlot.createMany({
                data: [
                    {
                        listing_id: listing.id,
                        date: new Date('2026-06-01'),
                        start_time: '08:00',
                        end_time: '12:00',
                        is_available: true,
                    },
                    {
                        listing_id: listing.id,
                        date: new Date('2026-06-02'),
                        start_time: '12:00',
                        end_time: '16:00',
                        is_available: true,
                    },
                ],
            });
        }
    }

    for (let i = 0; i < listings.length - 1; i++) {
        const buyer = companies[(i + 1) % companies.length];
        const seller = companies[i % companies.length];
        const listing = listings[i];

        await prisma.order.create({
            data: {
                listing_id: listing.id,
                buyer_company_id: buyer.id,
                seller_company_id: seller.id,
                pickup_slot_id: (await prisma.pickupSlot.findFirst({
                    where: { listing_id: listing.id },
                }))!.id,
                pickup_location_id: locations[i % locations.length].id,
                destination_id: locations[(i + 1) % locations.length].id,
                quantity: listing.quantity,
                unit: listing.unit,
                price_per_unit: listing.price_per_unit,
                platform_fee: 5,
                total: Number(listing.quantity) * Number(listing.price_per_unit),
                pickup_method: PickupMethod.pick_up,
                qr_code: `QR-${Date.now()}-${i}`,
                status: OrderStatus.completed,
                co2_saved_kg: 12.5,
            },
        });
    }

    console.log('Seeding completed successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
