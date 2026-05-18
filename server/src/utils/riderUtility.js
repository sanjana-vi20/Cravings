import axios from "axios";

export const calculateDistance = (orders, riderLat, riderLon) => {
  try {
    if (!Array.isArray(orders)) return [];

    return orders.map((order) => {
      // 1. Restaurant ki location nikalna (JSON structure ke hisaab se)
      const restaurantLat =
        order.items?.[0]?.restaurantID?.geoLocation?.lat ||
        order.restaurantId?.geoLocation?.lat;
      const restaurantLon =
        order.items?.[0]?.restaurantID?.geoLocation?.lon ||
        order.restaurantId?.geoLocation?.lon;

      let distance = 0;
      if (restaurantLat && restaurantLon) {
        // 2. Haversine formula call karna
        distance = getDistanceFromLatLonInKm(
          parseFloat(riderLat),
          parseFloat(riderLon),
          parseFloat(restaurantLat),
          parseFloat(restaurantLon),
        );
      }

      // 3. Nayi fields add karna bina purana data lose kiye
      return {
        ...(order.toObject ? order.toObject() : order), // Mongoose doc ko plain object banana
        distanceFromRider: distance, // Sorting ke liye numeric value
        totalDistance: `${distance.toFixed(2)} km`, // Display ke liye string
      };
    });
  } catch (error) {
    console.error("Distance Calc Error:", error);
    return orders;
  }
};

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
// "https://www.google.com/maps/dir/?api=1&origin=23.258142,77.520787&destination=23.2599,77.4126&travelmode=driving"
