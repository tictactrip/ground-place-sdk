import { GroundPlaceServiced, PlaceCreated, GroundPlace } from '../../src/types';

/**
 * @description Parse the place created to format it with the GroundPlaces structure.
 * @param {PlaceCreated} placeCreated - The place created from the `@tictactrip/gp-uid` package.
 * @returns {GroundPlace}
 */
const parsePlaceCreated = (placeCreated: PlaceCreated): GroundPlace => ({
  gpuid: placeCreated.id,
  name: placeCreated.name,
  longitude: placeCreated.longitude,
  latitude: placeCreated.latitude,
  country_code: placeCreated.countryCode,
  type: placeCreated.type,
  childs: [],
  serviced: GroundPlaceServiced.FALSE,
});

export { parsePlaceCreated };
