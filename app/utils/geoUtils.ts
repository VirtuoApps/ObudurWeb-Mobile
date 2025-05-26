/**
 * Calculate the distance between two geographic coordinates using the Haversine formula
 * @param lat1 - Latitude of the first point
 * @param lon1 - Longitude of the first point
 * @param lat2 - Latitude of the second point
 * @param lon2 - Longitude of the second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

/**
 * Convert degrees to radians
 * @param deg - Degrees
 * @returns Radians
 */
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Filter hotels by proximity to a given location
 * @param hotels - Array of hotels
 * @param targetLat - Target latitude
 * @param targetLon - Target longitude
 * @param radiusKm - Radius in kilometers (default: 50km)
 * @returns Filtered array of hotels within the specified radius
 */
export function filterHotelsByProximity(
  hotels: any[],
  targetLat: number,
  targetLon: number,
  radiusKm: number = 50
): any[] {
  return hotels.filter((hotel) => {
    if (
      !hotel.location ||
      !hotel.location.coordinates ||
      hotel.location.coordinates.length !== 2
    ) {
      return false;
    }

    const [hotelLon, hotelLat] = hotel.location.coordinates;
    const distance = calculateDistance(
      targetLat,
      targetLon,
      hotelLat,
      hotelLon
    );
    return distance <= radiusKm;
  });
}
