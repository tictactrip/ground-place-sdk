import { Storage } from '../../src/classes/storage';
import * as mockSmallGroundPlacesFile from '../../mocks/smallGroundPlacesFile.json';
import * as mockLargeGroundPlacesFile from '../../mocks/largeGroundPlacesFile.json';
import { AutoComplete, GroundPlaces, AutoCompleteFilters } from '../../src/types';

describe('#filterGroundPlaces', () => {
  const storageService: Storage = new Storage();

  it('should return an array of current ground places no filtered if no filters are provided', () => {
    storageService.initFile(mockSmallGroundPlacesFile as GroundPlaces);

    const autocompleteGroundPlaces: AutoComplete[] = storageService.filterGroundPlaces();

    expect(autocompleteGroundPlaces).toStrictEqual([
      {
        childs: ['g|FRststbi__@u0tkxd'],
        country_code: 'fr',
        gpuid: 'c|FRstrasbou@u0ts2',
        has_been_modified: false,
        is_latest: true,
        latitude: 48.583,
        longitude: 7.74815,
        name: 'Strasbourg, Grand-Est, France',
        serviced: 'True',
        type: 'cluster',
        unique_name: 'strasbourg',
        warning: false,
      },
      {
        childs: [
          {
            company_id: 5,
            company_name: 'flixbus',
            id: '19528',
            latitude: 48.616228,
            longitude: 7.719863,
            name: 'Strasbourg, Strasbourg - Bischheim',
            serviced: 'True',
            unique_name: null,
          },
        ],
        country_code: 'fr',
        gpuid: 'g|FRststbi__@u0tkxd',
        has_been_modified: false,
        is_latest: true,
        latitude: 48.616228,
        longitude: 7.719863,
        name: 'Strasbourg, Strasbourg - Bischheim',
        serviced: 'True',
        type: 'group',
        warning: false,
      },
    ]);
  });

  it('should filter Ground places only by Group', () => {
    storageService.initFile(mockSmallGroundPlacesFile as GroundPlaces);

    const autocompleteGroundPlaces: AutoComplete[] = storageService.filterGroundPlaces([
      AutoCompleteFilters.STOP_GROUP,
    ]);

    expect(autocompleteGroundPlaces).toStrictEqual([
      {
        childs: [
          {
            company_id: 5,
            company_name: 'flixbus',
            id: '19528',
            latitude: 48.616228,
            longitude: 7.719863,
            name: 'Strasbourg, Strasbourg - Bischheim',
            serviced: 'True',
            unique_name: null,
          },
        ],
        country_code: 'fr',
        gpuid: 'g|FRststbi__@u0tkxd',
        has_been_modified: false,
        is_latest: true,
        latitude: 48.616228,
        longitude: 7.719863,
        name: 'Strasbourg, Strasbourg - Bischheim',
        serviced: 'True',
        type: 'group',
        warning: false,
      },
    ]);
  });

  it('should filter Ground places only by Cluster', () => {
    storageService.initFile(mockSmallGroundPlacesFile as GroundPlaces);

    const autocompleteGroundPlaces: AutoComplete[] = storageService.filterGroundPlaces([
      AutoCompleteFilters.STOP_CLUSTER,
    ]);

    expect(autocompleteGroundPlaces).toStrictEqual([
      {
        childs: ['g|FRststbi__@u0tkxd'],
        country_code: 'fr',
        gpuid: 'c|FRstrasbou@u0ts2',
        has_been_modified: false,
        is_latest: true,
        latitude: 48.583,
        longitude: 7.74815,
        name: 'Strasbourg, Grand-Est, France',
        serviced: 'True',
        type: 'cluster',
        unique_name: 'strasbourg',
        warning: false,
      },
    ]);
  });

  it('should filter Ground places only by Segment Provider in it', () => {
    storageService.initFile(mockLargeGroundPlacesFile as GroundPlaces);

    const autocompleteGroundPlaces: AutoComplete[] = storageService.filterGroundPlaces([
      AutoCompleteFilters.SEGMENT_PROVIDER_STOP,
    ]);

    expect(autocompleteGroundPlaces).toStrictEqual([
      {
        gpuid: 'c|FRstrasbou@u0ts2',
        unique_name: 'strasbourg',
        childs: ['g|FRststbi__@u0tkxd', 'g|FRstrasbou@u0tkru', 'g|FRstraroet@u0tkr3'],
        serviced: 'False',
        has_been_modified: false,
        warning: false,
        country_code: 'fr',
        is_latest: true,
        name: 'Strasbourg, Grand-Est, France',
        longitude: 7.74815,
        latitude: 48.583,
        type: 'cluster',
      },
      {
        gpuid: 'g|FRstrasbou@u0tkru',
        childs: [
          {
            unique_name: null,
            company_name: 'flixbus',
            name: 'Strasbourg',
            latitude: 48.574179,
            serviced: 'False',
            company_id: 5,
            longitude: 7.754266,
            id: '23',
          },
        ],
        name: 'Strasbourg',
        longitude: 7.73417,
        serviced: 'False',
        has_been_modified: false,
        warning: false,
        country_code: 'fr',
        latitude: 48.58392,
        is_latest: true,
        type: 'group',
      },
      {
        gpuid: 'g|FRstraroet@u0tkr3',
        childs: [
          {
            unique_name: null,
            company_name: 'vsc',
            name: 'Strasbourg Roethig',
            latitude: 48.569,
            serviced: 'False',
            company_id: 10,
            longitude: 7.704,
            id: 'FRBUK',
          },
        ],
        name: 'Strasbourg Roethig',
        longitude: 7.704,
        serviced: 'False',
        has_been_modified: false,
        warning: false,
        country_code: 'fr',
        latitude: 48.569,
        is_latest: true,
        type: 'group',
      },
    ]);
  });

  it('should filter Ground places only by Serviced', () => {
    storageService.initFile(mockLargeGroundPlacesFile as GroundPlaces);

    const autocompleteGroundPlaces: AutoComplete[] = storageService.filterGroundPlaces([AutoCompleteFilters.SERVICED]);

    expect(autocompleteGroundPlaces).toStrictEqual([
      {
        gpuid: 'c|FRnaarto__@u0skg',
        unique_name: 'nancy---tous-les-arrets',
        childs: [],
        serviced: 'True',
        has_been_modified: false,
        warning: false,
        country_code: 'fr',
        is_latest: true,
        name: 'Nancy - Tous les arrêts, Grand Est, France',
        longitude: 6.1444727044,
        latitude: 48.6484863111,
        type: 'cluster',
      },
    ]);
  });

  it('should filter Ground places by StopGroup and StopCluster', () => {
    storageService.initFile(mockSmallGroundPlacesFile as GroundPlaces);

    const autocompleteGroundPlaces: AutoComplete[] = storageService.filterGroundPlaces([
      AutoCompleteFilters.STOP_GROUP,
      AutoCompleteFilters.STOP_CLUSTER,
    ]);

    expect(autocompleteGroundPlaces).toStrictEqual([
      {
        childs: [
          {
            company_id: 5,
            company_name: 'flixbus',
            id: '19528',
            latitude: 48.616228,
            longitude: 7.719863,
            name: 'Strasbourg, Strasbourg - Bischheim',
            serviced: 'True',
            unique_name: null,
          },
        ],
        country_code: 'fr',
        gpuid: 'g|FRststbi__@u0tkxd',
        has_been_modified: false,
        is_latest: true,
        latitude: 48.616228,
        longitude: 7.719863,
        name: 'Strasbourg, Strasbourg - Bischheim',
        serviced: 'True',
        type: 'group',
        warning: false,
      },
      {
        childs: ['g|FRststbi__@u0tkxd'],
        country_code: 'fr',
        gpuid: 'c|FRstrasbou@u0ts2',
        has_been_modified: false,
        is_latest: true,
        latitude: 48.583,
        longitude: 7.74815,
        name: 'Strasbourg, Grand-Est, France',
        serviced: 'True',
        type: 'cluster',
        unique_name: 'strasbourg',
        warning: false,
      },
    ]);
  });

  it('should filter Ground places by Group, Cluster and Segment Provider in it', () => {
    storageService.initFile(mockSmallGroundPlacesFile as GroundPlaces);

    const autocompleteGroundPlaces: AutoComplete[] = storageService.filterGroundPlaces([
      AutoCompleteFilters.STOP_GROUP,
      AutoCompleteFilters.STOP_CLUSTER,
      AutoCompleteFilters.SEGMENT_PROVIDER_STOP,
    ]);

    expect(autocompleteGroundPlaces).toStrictEqual([
      {
        childs: [
          {
            company_id: 5,
            company_name: 'flixbus',
            id: '19528',
            latitude: 48.616228,
            longitude: 7.719863,
            name: 'Strasbourg, Strasbourg - Bischheim',
            serviced: 'True',
            unique_name: null,
          },
        ],
        country_code: 'fr',
        gpuid: 'g|FRststbi__@u0tkxd',
        has_been_modified: false,
        is_latest: true,
        latitude: 48.616228,
        longitude: 7.719863,
        name: 'Strasbourg, Strasbourg - Bischheim',
        serviced: 'True',
        type: 'group',
        warning: false,
      },
      {
        childs: ['g|FRststbi__@u0tkxd'],
        country_code: 'fr',
        gpuid: 'c|FRstrasbou@u0ts2',
        has_been_modified: false,
        is_latest: true,
        latitude: 48.583,
        longitude: 7.74815,
        name: 'Strasbourg, Grand-Est, France',
        serviced: 'True',
        type: 'cluster',
        unique_name: 'strasbourg',
        warning: false,
      },
    ]);
  });

  it('should filter Ground places by Group, Cluster, Segment Provider in it and Serviced', () => {
    storageService.initFile(mockSmallGroundPlacesFile as GroundPlaces);

    const autocompleteGroundPlaces: AutoComplete[] = storageService.filterGroundPlaces([
      AutoCompleteFilters.STOP_GROUP,
      AutoCompleteFilters.STOP_CLUSTER,
      AutoCompleteFilters.SEGMENT_PROVIDER_STOP,
      AutoCompleteFilters.SERVICED,
    ]);

    expect(autocompleteGroundPlaces).toStrictEqual([
      {
        childs: [
          {
            company_id: 5,
            company_name: 'flixbus',
            id: '19528',
            latitude: 48.616228,
            longitude: 7.719863,
            name: 'Strasbourg, Strasbourg - Bischheim',
            serviced: 'True',
            unique_name: null,
          },
        ],
        country_code: 'fr',
        gpuid: 'g|FRststbi__@u0tkxd',
        has_been_modified: false,
        is_latest: true,
        latitude: 48.616228,
        longitude: 7.719863,
        name: 'Strasbourg, Strasbourg - Bischheim',
        serviced: 'True',
        type: 'group',
        warning: false,
      },
      {
        childs: ['g|FRststbi__@u0tkxd'],
        country_code: 'fr',
        gpuid: 'c|FRstrasbou@u0ts2',
        has_been_modified: false,
        is_latest: true,
        latitude: 48.583,
        longitude: 7.74815,
        name: 'Strasbourg, Grand-Est, France',
        serviced: 'True',
        type: 'cluster',
        unique_name: 'strasbourg',
        warning: false,
      },
    ]);
  });
});
