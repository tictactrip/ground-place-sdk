// -----------------------------------------------------------------------------
//  --------------------------------- TYPES ------------------------------------
// -----------------------------------------------------------------------------

type GroundPlace = StopGroup | StopCluster;

type GroundPlaces = Record<Gpuid, GroundPlace>;

type Gpuid = string;

type StopGroupGpuid = Gpuid;

type StopClusterGpuid = Gpuid;

type AutoComplete = StopGroupAutocomplete | StopClusterAutocomplete;

// -----------------------------------------------------------------------------
//  ------------------------------- INTERFACES ---------------------------------
// -----------------------------------------------------------------------------

interface StopGroup {
  country_code: CountryCode;
  name: string;
  longitude: number;
  latitude: number;
  type: GroundPlaceType.GROUP;
  childs: SegmentProviderStop[];
  serviced: GroundPlaceServiced;
  has_been_modified?: boolean;
  warning?: boolean;
  is_latest?: boolean;
}

interface StopCluster {
  country_code: CountryCode;
  name: string;
  longitude: number;
  latitude: number;
  type: GroundPlaceType.CLUSTER;
  childs: StopGroupGpuid[];
  serviced: GroundPlaceServiced;
  unique_name?: string;
  has_been_modified?: boolean;
  warning?: boolean;
  is_latest?: boolean;
}

interface SegmentProviderStop {
  unique_name: null;
  company_name: string;
  name: string;
  latitude: number;
  serviced: GroundPlaceServiced;
  company_id: number;
  longitude: number;
  id: string;
}

interface CreateStopGroupProperties {
  countryCode: CountryCode;
  name: string;
  longitude: number;
  latitude: number;
  type: GroundPlaceType;
  serviced: GroundPlaceServiced;
  segmentProviderStop: SegmentProviderStop;
}

interface CreateStopClusterProperties {
  countryCode: CountryCode;
  name: string;
  longitude: number;
  latitude: number;
  type: GroundPlaceType;
  serviced: GroundPlaceServiced;
}

interface UpdateStopProperties {
  name?: string;
  longitude?: number;
  latitude?: number;
}

interface GroundPlacesDiff {
  [gpuid: string]: {
    type: GroundPlaceActionType;
    into?: string;
  };
}

// TODO: Implement these interfaces

interface StopGroupAutocomplete extends StopGroup {
  gpuid: StopGroupGpuid;
}

interface StopClusterAutocomplete extends StopCluster {
  gpuid: StopClusterGpuid;
}

// -----------------------------------------------------------------------------
//  --------------------------------- ENUMS ------------------------------------
// -----------------------------------------------------------------------------

enum GroundPlaceActionType {
  CREATE = 'create',
  MOVE = 'move',
  UPDATE = 'update',
  DELETE = 'delete',
}

enum GroundPlaceType {
  GROUP = 'group',
  CLUSTER = 'cluster',
}

enum GroundPlaceServiced {
  TRUE = 'True',
  FALSE = 'False',
}

enum AutoCompleteFilters {
  STOP_GROUP = 'stopGroup',
  STOP_CLUSTER = 'stopCluster',
  SERVICED = 'serviced',
  SEGMENT_PROVIDER_STOP = 'segmentProviderStop',
}

enum CountryCode {
  AF = 'af',
  AL = 'al',
  DZ = 'dz',
  AS = 'as',
  AD = 'ad',
  AO = 'ao',
  AI = 'ai',
  AQ = 'aq',
  AG = 'ag',
  AR = 'ar',
  AM = 'am',
  AW = 'aw',
  AU = 'au',
  AT = 'at',
  AZ = 'az',
  BS = 'bs',
  BH = 'bh',
  BD = 'bd',
  BB = 'bb',
  BY = 'by',
  BE = 'be',
  BZ = 'bz',
  BJ = 'bj',
  BM = 'bm',
  BT = 'bt',
  BO = 'bo',
  BQ = 'bq',
  BA = 'ba',
  BW = 'bw',
  BV = 'bv',
  BR = 'br',
  IO = 'io',
  BN = 'bn',
  BG = 'bg',
  BF = 'bf',
  BI = 'bi',
  CV = 'cv',
  KH = 'kh',
  CM = 'cm',
  CA = 'ca',
  KY = 'ky',
  CF = 'cf',
  TD = 'td',
  CL = 'cl',
  CN = 'cn',
  CX = 'cx',
  CC = 'cc',
  CO = 'co',
  KM = 'km',
  CD = 'cd',
  CG = 'cg',
  CK = 'ck',
  CR = 'cr',
  HR = 'hr',
  CU = 'cu',
  CW = 'cw',
  CY = 'cy',
  CZ = 'cz',
  CI = 'ci',
  DK = 'dk',
  DJ = 'dj',
  DM = 'dm',
  DO = 'do',
  EC = 'ec',
  EG = 'eg',
  SV = 'sv',
  GQ = 'gq',
  ER = 'er',
  EE = 'ee',
  SZ = 'sz',
  ET = 'et',
  FK = 'fk',
  FO = 'fo',
  FJ = 'fj',
  FI = 'fi',
  FR = 'fr',
  GF = 'gf',
  PF = 'pf',
  TF = 'tf',
  GA = 'ga',
  GM = 'gm',
  GE = 'ge',
  DE = 'de',
  GH = 'gh',
  GI = 'gi',
  GR = 'gr',
  GL = 'gl',
  GD = 'gd',
  GP = 'gp',
  GU = 'gu',
  GT = 'gt',
  GG = 'gg',
  GN = 'gn',
  GW = 'gw',
  GY = 'gy',
  HT = 'ht',
  HM = 'hm',
  VA = 'va',
  HN = 'hn',
  HK = 'hk',
  HU = 'hu',
  IS = 'is',
  IN = 'in',
  ID = 'id',
  IR = 'ir',
  IQ = 'iq',
  IE = 'ie',
  IM = 'im',
  IL = 'il',
  IT = 'it',
  JM = 'jm',
  JP = 'jp',
  JE = 'je',
  JO = 'jo',
  KZ = 'kz',
  KE = 'ke',
  KI = 'ki',
  KP = 'kp',
  KR = 'kr',
  KW = 'kw',
  KG = 'kg',
  LA = 'la',
  LV = 'lv',
  LB = 'lb',
  LS = 'ls',
  LR = 'lr',
  LY = 'ly',
  LI = 'li',
  LT = 'lt',
  LU = 'lu',
  MO = 'mo',
  MG = 'mg',
  MW = 'mw',
  MY = 'my',
  MV = 'mv',
  ML = 'ml',
  MT = 'mt',
  MH = 'mh',
  MQ = 'mq',
  MR = 'mr',
  MU = 'mu',
  YT = 'yt',
  MX = 'mx',
  FM = 'fm',
  MD = 'md',
  MC = 'mc',
  MN = 'mn',
  ME = 'me',
  MS = 'ms',
  MA = 'ma',
  MZ = 'mz',
  MM = 'mm',
  NA = 'na',
  NR = 'nr',
  NP = 'np',
  NL = 'nl',
  NC = 'nc',
  NZ = 'nz',
  NI = 'ni',
  NE = 'ne',
  NG = 'ng',
  NU = 'nu',
  NF = 'nf',
  MP = 'mp',
  NO = 'no',
  OM = 'om',
  PK = 'pk',
  PW = 'pw',
  PS = 'ps',
  PA = 'pa',
  PG = 'pg',
  PY = 'py',
  PE = 'pe',
  PH = 'ph',
  PN = 'pn',
  PL = 'pl',
  PT = 'pt',
  PR = 'pr',
  QA = 'qa',
  MK = 'mk',
  RO = 'ro',
  RU = 'ru',
  RW = 'rw',
  RE = 're',
  BL = 'bl',
  SH = 'sh',
  KN = 'kn',
  LC = 'lc',
  MF = 'mf',
  PM = 'pm',
  VC = 'vc',
  WS = 'ws',
  SM = 'sm',
  ST = 'st',
  SA = 'sa',
  SN = 'sn',
  RS = 'rs',
  SC = 'sc',
  SL = 'sl',
  SG = 'sg',
  SX = 'sx',
  SK = 'sk',
  SI = 'si',
  SB = 'sb',
  SO = 'so',
  ZA = 'za',
  GS = 'gs',
  SS = 'ss',
  ES = 'es',
  LK = 'lk',
  SD = 'sd',
  SR = 'sr',
  SJ = 'sj',
  SE = 'se',
  CH = 'ch',
  SY = 'sy',
  TW = 'tw',
  TJ = 'tj',
  TZ = 'tz',
  TH = 'th',
  TL = 'tl',
  TG = 'tg',
  TK = 'tk',
  TO = 'to',
  TT = 'tt',
  TN = 'tn',
  TR = 'tr',
  TM = 'tm',
  TC = 'tc',
  TV = 'tv',
  UG = 'ug',
  UA = 'ua',
  AE = 'ae',
  GB = 'gb',
  UM = 'um',
  US = 'us',
  UY = 'uy',
  UZ = 'uz',
  VU = 'vu',
  VE = 've',
  VN = 'vn',
  VG = 'vg',
  VI = 'vi',
  WF = 'wf',
  EH = 'eh',
  YE = 'ye',
  ZM = 'zm',
  ZW = 'zw',
  AX = 'ax',
}

export {
  Gpuid,
  StopGroupGpuid,
  StopClusterGpuid,
  StopGroup,
  StopCluster,
  SegmentProviderStop,
  AutoComplete,
  AutoCompleteFilters,
  GroundPlaces,
  GroundPlacesDiff,
  GroundPlaceType,
  GroundPlaceServiced,
  GroundPlaceActionType,
  CreateStopGroupProperties,
  CreateStopClusterProperties,
  UpdateStopProperties,
};
