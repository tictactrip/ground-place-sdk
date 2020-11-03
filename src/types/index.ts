// @ts-ignore
interface AutoComplete {}

interface StopGroup {}

interface StopCluster {}

interface StopGroupProperties {}

interface StopClusterProperties {}

interface Filters {}

interface GroundPlacesDiff {}

type StopGroupGpuid = string;

type StopClusterGpuid = string;

enum GroundPlaceType {
  Group = 'group',
  Cluster = 'cluster',
}

export {
  AutoComplete,
  StopGroup,
  StopCluster,
  StopGroupProperties,
  StopClusterProperties,
  Filters,
  GroundPlacesDiff,
  StopGroupGpuid,
  StopClusterGpuid,
  GroundPlaceType,
};
