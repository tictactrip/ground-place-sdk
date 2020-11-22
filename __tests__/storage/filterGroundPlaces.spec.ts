import { Storage } from '../../src/classes/storage';
import * as mockSmallGroundPlacesFile from '../../mocks/smallGroundPlacesFile.json';
import * as mockLargeGroundPlacesFile from '../../mocks/largeGroundPlacesFile.json';
import { AutoComplete, GroundPlaces, AutoCompleteFilters } from '../../src/types';

describe('#filterGroundPlaces', () => {
  const storageInstance: Storage = new Storage();

  it('should return an array of current ground places no filtered if no filters are provided', () => {
    storageInstance.initFile(mockSmallGroundPlacesFile as GroundPlaces);

    const autocompleteGroundPlaces: AutoComplete[] = storageInstance.filterGroundPlaces();

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
    storageInstance.initFile(mockSmallGroundPlacesFile as GroundPlaces);

    const autocompleteGroundPlaces: AutoComplete[] = storageInstance.filterGroundPlaces([
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
    storageInstance.initFile(mockSmallGroundPlacesFile as GroundPlaces);

    const autocompleteGroundPlaces: AutoComplete[] = storageInstance.filterGroundPlaces([
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
    storageInstance.initFile(mockLargeGroundPlacesFile as GroundPlaces);

    const autocompleteGroundPlaces: AutoComplete[] = storageInstance.filterGroundPlaces([
      AutoCompleteFilters.SEGMENT_PROVIDER_STOP,
    ]);

    expect(autocompleteGroundPlaces).toStrictEqual([]);
  });

  it('should filter Ground places only by Serviced', () => {
    storageInstance.initFile(mockSmallGroundPlacesFile as GroundPlaces);

    const autocompleteGroundPlaces: AutoComplete[] = storageInstance.filterGroundPlaces([AutoCompleteFilters.SERVICED]);

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

  it('should filter Ground places by StopGroup and StopCluster', () => {
    storageInstance.initFile(mockSmallGroundPlacesFile as GroundPlaces);

    const autocompleteGroundPlaces: AutoComplete[] = storageInstance.filterGroundPlaces([
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
    storageInstance.initFile(mockSmallGroundPlacesFile as GroundPlaces);

    const autocompleteGroundPlaces: AutoComplete[] = storageInstance.filterGroundPlaces([
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
    storageInstance.initFile(mockSmallGroundPlacesFile as GroundPlaces);

    const autocompleteGroundPlaces: AutoComplete[] = storageInstance.filterGroundPlaces([
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
