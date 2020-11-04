// @ts-ignore
interface AutoComplete {}

interface StopGroup {
  [stopGroupGpuid: string]: {
    country_code: string;
    name: string;
    longitude: number;
    latitude: number;
    type: string;
    childs: SegmentProviderStop[];
    serviced?: string;
    has_been_modified?: boolean;
    warning?: boolean;
    is_latest?: boolean;
  };
}

interface StopCluster {
  [stopClusterGpuid: string]: {
    country_code: string;
    name: string;
    longitude: number;
    latitude: number;
    type: string;
    childs: string[];
    unique_name?: string;
    serviced?: string;
    has_been_modified?: boolean;
    warning?: boolean;
    is_latest?: boolean;
  };
}

type GroundPlacesList = (StopGroup | StopCluster)[];

interface StopClusterInfos {
  countryCode: string;
  name: string;
  longitude: number;
  latitude: number;
  type: string;
}

interface GroundPlaceGenerated {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  countryCode: string;
  type: string;
  ancestorId?: string;
}

interface SegmentProviderStop {
  unique_name: null;
  company_name: string;
  name: string;
  latitude: number;
  serviced: string;
  company_id: number;
  longitude: number;
  id: string;
}

interface StopGroupProperties {}

interface StopClusterProperties {}

interface Filters {}

interface GroundPlacesDiff {}

type Gpuid = string;

type StopGroupGpuid = Gpuid;

type StopClusterGpuid = Gpuid;

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
  GroundPlacesList,
  GroundPlaceGenerated,
  StopClusterInfos,
  StopGroupProperties,
  StopClusterProperties,
  Filters,
  GroundPlacesDiff,
  StopGroupGpuid,
  StopClusterGpuid,
  GroundPlaceType,
  AutoCompleteFilters,
};
