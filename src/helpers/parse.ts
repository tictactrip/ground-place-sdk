import { GroundPlaceServiced, GenerateGpuidGroundPlace, GroundPlace, GroundPlaceType } from '../types';
import { removeUndefinedValues } from './sanitize';

/**
 * @description Parse the place created to format it with the GroundPlaces structure.
 * @param {GenerateGpuidGroundPlace} generateGpuidGroundPlace - The Ground place generated from the `@tictactrip/gp-uid` package.
 * @returns {GroundPlace}
 */
const parseGeneratePlaceToGroundPlace = (generateGpuidGroundPlace: GenerateGpuidGroundPlace): GroundPlace => {
  const newGroundPlace: GroundPlace = {
    address: generateGpuidGroundPlace.address,
    gpuid: generateGpuidGroundPlace.id,
    name: generateGpuidGroundPlace.name,
    longitude: generateGpuidGroundPlace.longitude,
    latitude: generateGpuidGroundPlace.latitude,
    country_code: generateGpuidGroundPlace.countryCode,
    type: generateGpuidGroundPlace.type,
    childs: [],
    serviced: GroundPlaceServiced.FALSE,
    // Create `unique_name` attribute set to `null` only for StopCluster
    ...(generateGpuidGroundPlace.type === GroundPlaceType.CLUSTER ? { unique_name: null } : {}),
  };

  removeUndefinedValues(newGroundPlace);

  return newGroundPlace;
};

export { parseGeneratePlaceToGroundPlace };
