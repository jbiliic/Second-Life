import { BadRequestException } from '@nestjs/common';

export interface GeoAddress {
    country: string;
    city: string;
    zip: string;
    street: string;
    street_number: string;
    latitude: number;
    longitude: number;
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<GeoAddress> {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&zoom=18`,
        {
            headers: {
                'Accept-Language': 'hr',
                'User-Agent': 'YourAppName/1.0 (jopab03@gmail.com)',
            },
        },
    );

    const data = await res.json();
    const a = data.address;

    if (!a) {
        throw new BadRequestException('Could not resolve address from coordinates');
    }

    return {
        country: a.country ?? '',
        city: a.city ?? a.town ?? a.village ?? a.municipality ?? '',
        zip: a.postcode ?? '',
        street: a.road ?? a.pedestrian ?? '',
        street_number: a.house_number ?? '',
        latitude,
        longitude,
    };
}
