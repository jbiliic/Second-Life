export interface GeoAddress {
    country: string;
    city: string;
    zip: string;
    street: string;
    street_number: string;
    latitude: number;
    longitude: number;
}

export async function reverseGeocode(lat: number, lng: number): Promise<GeoAddress | null> {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&zoom=18`,
        { headers: { 'Accept-Language': 'hr' } },
    );

    const data = await res.json();
    const a = data.address;

    if (!a) return null;

    return {
        country: a.country ?? '',
        city: a.city ?? a.town ?? a.village ?? a.municipality ?? '',
        zip: a.postcode ?? '',
        street: a.road ?? a.pedestrian ?? '',
        street_number: a.house_number ?? '',
        latitude: lat,
        longitude: lng,
    };
}
