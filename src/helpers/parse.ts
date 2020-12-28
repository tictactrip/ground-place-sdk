import { StopGroup, StopGroupCreated, GroundPlaceServiced, StopCluster, StopClusterCreated } from '../../src/types';

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

/**
 * @description Parse the StopCluster created to format it with the GroundPlaces structure.
 * @param {StopClusterCreated} stopClusterCreated - The StopCluster created from the `@tictactrip/gp-uid` package.
 */
const parseStopClusterCreated = (stopClusterCreated: StopClusterCreated): StopCluster => ({
  gpuid: stopClusterCreated.id,
  name: stopClusterCreated.name,
  longitude: stopClusterCreated.longitude,
  latitude: stopClusterCreated.latitude,
  country_code: stopClusterCreated.countryCode,
  type: stopClusterCreated.type,
  childs: [],
  serviced: GroundPlaceServiced.FALSE,
});

export { parseStopGroupCreated, parseStopClusterCreated };
