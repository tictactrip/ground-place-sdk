// @ts-ignore
interface AutoComplete {}

type GroundPlacesFile = Record<Gpuid, StopGroup | StopCluster>;

interface StopGroup {
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
}

interface StopCluster {
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
}

type GroundPlacesArray = {
  gpuid: Gpuid;
  place: StopGroup | StopCluster;
}[];

interface StopGroupInfos {
  countryCode: string;
  name: string;
  longitude: number;
  latitude: number;
  type: string;
  currentStopGroupGpuid: StopGroupGpuid;
  serviced: string;
}

interface StopClusterInfos {
  countryCode: string;
  name: string;
  longitude: number;
  latitude: number;
  type: string;
  currentStopGroupGpuid: StopGroupGpuid;
  serviced: string;
}

interface GroundPlaceGenerated {
  id: StopGroupGpuid | StopClusterGpuid;
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

type GroundPlacesDiff = GroundPlacesDiffAction[];

interface GroundPlacesDiffAction {
  [gpuid: string]: {
    type: GroundPlacesDiffActionType;
    into?: string;
    segmentProviderStopId?: string;
    latitude?: number;
    longitude?: number;
    name?: string;
  };
}

enum GroundPlacesDiffActionType {
  Add = 'add',
  Create = 'create',
  Move = 'move',
  Update = 'update',
  Delete = 'delete',
  MoveSegmentProviderStop = 'moveSegmentProviderStop',
}

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
  GroundPlacesArray,
  GroundPlaceGenerated,
  SegmentProviderStop,
  StopGroupInfos,
  StopClusterInfos,
  StopGroupProperties,
  StopClusterProperties,
  Filters,
  GroundPlacesDiff,
  GroundPlacesDiffAction,
  GroundPlacesDiffActionType,
  Gpuid,
  StopGroupGpuid,
  StopClusterGpuid,
  GroundPlaceType,
  AutoCompleteFilters,
  GroundPlacesFile,
};
