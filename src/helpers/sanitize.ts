/**
 * @description Helper to remove all `undefined` values from any object.
 * @param {Record<string, unknown>} object - Any object that is structured with string index.
 * @returns {void}
 */
const removeUndefinedValues = <T>(object: T): void => {
  Object.keys(object).forEach((key: string) => {
    if (object[key] === undefined) {
      delete object[key];
    }
  });
};

export { removeUndefinedValues };
