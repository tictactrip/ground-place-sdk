import { GroundPlace } from 'src/types';

/**
 * @description This function uses the ‘haversine’ formula to calculate the great-circle distance between two points.
 *
 * That is the shortest distance over the earth’s surface.
 *
 * Original calculations from 'https://www.movable-type.co.uk/scripts/latlong.html'.
 * @param {GroundPlace} firstPlace - The first place to check, it could be a StopGroup or a StopCluster.
 * @param {GroundPlace} secondPlace - The second place to check, it also could be a StopGroup or a StopCluster.
 */
const distanceBetweenTwoPlaceInKms = (firstPlace: GroundPlace, secondPlace: GroundPlace): number => {
  const { latitude: firstPlaceLat, longitude: firstPlaceLong } = firstPlace;
  const { latitude: secondPlaceLat, longitude: secondPlaceLong } = secondPlace;

  if (!firstPlaceLat || !firstPlaceLat || !secondPlaceLat || !secondPlaceLong) {
    throw new Error(
      'Can\'t calculate the distance between the two places used. Please check that the values given for the "latitude" and the "longitude" are correctly setted',
    );
  }

  // Radius of the earth in metres
  const R = 6371e3;

  // φ, λ in radians
  const φ1 = (firstPlaceLat * Math.PI) / 180;
  const φ2 = (secondPlaceLat * Math.PI) / 180;
  const Δφ = ((secondPlaceLat - firstPlaceLat) * Math.PI) / 180;
  const Δλ = ((secondPlaceLong - firstPlaceLong) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const distance = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // distance in kms rounded to the nearest integer
  return Math.round((R * distance) / 1000);
};

export { distanceBetweenTwoPlaceInKms };
