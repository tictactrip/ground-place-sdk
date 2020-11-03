// @ts-ignore
interface AutoComplete {}

interface StopGroup {}

interface StopCluster {}

interface StopGroupProperties {}

interface StopClusterProperties {}

interface Filters {}

interface GroundPlacesDiff {}

type Gpuid = string;

type StopGroupGpuid = Gpuid;

type StopClusterGpuid = Gpuid;

enum GroundPlaceType {
  Group = 'group',
  Cluster = 'cluster',
}

enum AutoCompleteFilters {
  Name,
  Gpuid,
  Uniquename,
  OtherName,
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
  AutoCompleteFilters,
};
