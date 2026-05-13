import axios from "axios";

export const calculateDistance = async (orders, lat, lon) => {
  try {
    if (!Array.isArray(orders)) return [];

    const ordersWithDistance = orders.map((order) => {
      const restaurantLat = order.restaurantId?.geoLocation?.lat;
      const restaurantLon = order.restaurantId?.geoLocation?.lon;

      const distance = getDistanceFromLatLonInKm(
        lat,
        lon,
        restaurantLat,
        restaurantLon
      );

      return {
        ...(order._doc || order), 
        distanceFromRider: distance, // Sorting ke liye pure number
        totalDistance: `${distance.toFixed(2)} km`, // Frontend pe dikhane ke liye readable string
      };
    });

    // Distance ke hisaab se sort karein (Sabse paas wala upar)
    ordersWithDistance.sort((a, b) => a.distanceFromRider - b.distanceFromRider);

    return ordersWithDistance;
  } catch (error) {
    console.error("Sort Error:", error);
    throw error;
  }
};

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
// "https://www.google.com/maps/dir/?api=1&origin=23.258142,77.520787&destination=23.2599,77.4126&travelmode=driving"