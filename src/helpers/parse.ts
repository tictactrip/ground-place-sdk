import { GroundPlaceServiced, GenerateGpuidGroundPlace, GroundPlace } from '../types';

/**
 * @description Parse the place created to format it with the GroundPlaces structure.
 * @param {GenerateGpuidGroundPlace} generateGpuidGroundPlace - The Ground place generated from the `@tictactrip/gp-uid` package.
 * @returns {GroundPlace}
 */
const parseGeneratePlaceToGroundPlace = (generateGpuidGroundPlace: GenerateGpuidGroundPlace): GroundPlace => ({
  gpuid: generateGpuidGroundPlace.id,
  name: generateGpuidGroundPlace.name,
  longitude: generateGpuidGroundPlace.longitude,
  latitude: generateGpuidGroundPlace.latitude,
  country_code: generateGpuidGroundPlace.countryCode,
  type: generateGpuidGroundPlace.type,
  childs: [],
  serviced: GroundPlaceServiced.FALSE,
});

export { parseGeneratePlaceToGroundPlace };
