import { UpdateGroundPlaceProperties } from '../types';

/**
 * @description Helper to remove all `undefined` values from any object.
 * @param {Record<string, unknown>} object - Any object that is structured with string index.
 * @returns {void}
 */
const removeUndefinedValues = (object: Record<string, unknown>): void => {
  Object.keys(object).forEach((key: string) => {
    if (object[key] === undefined) {
      delete object[key];
    }
  });
};

/**
 * @description This method is used to remove all `undefined` values that can be found on the propertiesToUpdate object.
 * @param {UpdateGroundPlaceProperties} propertiesToUpdate - Properties to update {name, lattitude, longitude}.
 * @returns {void}
 */
const sanitizeGroundPlacePropertiesToUpdate = (propertiesToUpdate: UpdateGroundPlaceProperties): void => {
  removeUndefinedValues(propertiesToUpdate);
};

export { removeUndefinedValues, sanitizeGroundPlacePropertiesToUpdate };
