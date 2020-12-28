import { StopGroup, StopGroupCreated, GroundPlaceServiced } from '../../src/types';

/**
 * @description Parse the StopGroup created to format it with the GroundPlaces structure.
 * @param {StopGroupCreated} stopGroupCreated - The StopGroup created from the `@tictactrip/gp-uid` package.
 */
const parseStopGroupCreated = (stopGroupCreated: StopGroupCreated): StopGroup => ({
  gpuid: stopGroupCreated.id,
  name: stopGroupCreated.name,
  longitude: stopGroupCreated.longitude,
  latitude: stopGroupCreated.latitude,
  country_code: stopGroupCreated.countryCode,
  type: stopGroupCreated.type,
  childs: [],
  serviced: GroundPlaceServiced.FALSE,
});

export { parseStopGroupCreated };
