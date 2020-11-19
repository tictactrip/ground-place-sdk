/**
 * @description Clone an Object deeply nested.
 * @param {any} object - Object to clone.
 * @returns {any}
 */
function cloneObject(object: any): any {
  return JSON.parse(JSON.stringify(object));
}

export { cloneObject };
