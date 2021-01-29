import { UpdateGroundPlaceProperties } from '../types';

/**
 * @description This method is used to remove all `undefined` values that can be found on the propertiesToUpdate object.
 * @param {UpdateGroundPlaceProperties} propertiesToUpdate - Properties to update {name, lattitude, longitude}.
 * @returns {void}
 */
const sanitizeGroundPlacePropertiesToUpdate = (propertiesToUpdate: UpdateGroundPlaceProperties): void => {
  Object.keys(propertiesToUpdate).forEach((key: string) => {
    if (propertiesToUpdate[key] === undefined) {
      delete propertiesToUpdate[key];
    }
  });
};

export { sanitizeGroundPlacePropertiesToUpdate };
