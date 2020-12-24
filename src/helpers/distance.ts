import { GroundPlace } from 'src/types';

/**
 * @description This function uses the ‘haversine’ formula to calculate the great-circle distance between two points.
 *
 * That is the shortest distance over the earth’s surface.
 *
 * Original calculations from 'https://www.movable-type.co.uk/scripts/latlong.html'.
 * @param {GroundPlace} firstPlace - The first place to check, it could be a StopGroup or a StopCluster.
 * @param {GroundPlace} secondPlace - The second place to check, it also could be a StopGroup or a StopCluster.
 * @returns {number}
 */
const distanceBetweenTwoPlaceInKm = (firstPlace: GroundPlace, secondPlace: GroundPlace): number => {
  const { latitude: firstPlaceLat, longitude: firstPlaceLong } = firstPlace;
  const { latitude: secondPlaceLat, longitude: secondPlaceLong } = secondPlace;

  if (!firstPlaceLat || !firstPlaceLong || !secondPlaceLat || !secondPlaceLong) {
    throw new Error(
      'Can\'t calculate the distance between the two places used. Please check that the values given for the "latitude" and the "longitude" are correctly setted',
    );
  }

  // Radius of the earth in meters
  const R = 6371e3;

  const radLat1 = (firstPlaceLat * Math.PI) / 180;
  const radLat2 = (secondPlaceLat * Math.PI) / 180;
  const dLat = ((secondPlaceLat - firstPlaceLat) * Math.PI) / 180;
  const dLong = ((secondPlaceLong - firstPlaceLong) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
  const distance = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distance in km
  const distanceInKm = (R * distance) / 1000;

  return parseFloat(distanceInKm.toFixed(2));
};

export { distanceBetweenTwoPlaceInKm };
