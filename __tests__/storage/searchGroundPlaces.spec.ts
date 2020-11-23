import { Storage } from '../../src/classes/storage';
import { CountryCode, GroundPlaceType, GroundPlaceServiced, AutoComplete } from '../../src/types';

describe('#searchGroundPlaces', () => {
  const storageService: Storage = new Storage();

  const groundPlacesAutocomplete: AutoComplete[] = [
    {
      gpuid: 'c|FRstrasbou@u0ts2',
      unique_name: 'strasbourg',
      childs: ['g|FRstrasbou@u0tkru', 'g|FRstraroet@u0tkr3'],
      serviced: GroundPlaceServiced.FALSE,
      has_been_modified: false,
      warning: false,
      country_code: CountryCode.FR,
      is_latest: true,
      name: 'Strasbourg, Grand-Est, France',
      longitude: 7.74815,
      latitude: 48.583,
      type: GroundPlaceType.CLUSTER,
    },
    {
      gpuid: 'g|FRstrasbou@u0tkru',
      childs: [
        {
          unique_name: null,
          company_name: 'flixbus',
          name: 'Strasbourg',
          latitude: 48.574179,
          serviced: GroundPlaceServiced.FALSE,
          company_id: 5,
          longitude: 7.754266,
          id: '23',
        },
      ],
      name: 'Strasbourg',
      longitude: 7.73417,
      serviced: GroundPlaceServiced.FALSE,
      has_been_modified: false,
      warning: false,
      country_code: CountryCode.FR,
      latitude: 48.58392,
      is_latest: true,
      type: GroundPlaceType.GROUP,
    },
    {
      gpuid: 'g|FRstraroet@u0tkr3',
      childs: [
        {
          unique_name: null,
          company_name: 'vsc',
          name: 'Strasbourg Roethig',
          latitude: 48.569,
          serviced: GroundPlaceServiced.FALSE,
          company_id: 10,
          longitude: 7.704,
          id: 'FRBUK',
        },
      ],
      name: 'Strasbourg Roethig',
      longitude: 7.704,
      serviced: GroundPlaceServiced.FALSE,
      has_been_modified: false,
      warning: false,
      country_code: CountryCode.FR,
      latitude: 48.569,
      is_latest: true,
      type: GroundPlaceType.GROUP,
    },
    {
      gpuid: 'c|FRnaarto__@u0skg',
      unique_name: 'nancy---tous-les-arrets',
      childs: [],
      serviced: GroundPlaceServiced.FALSE,
      has_been_modified: false,
      warning: false,
      country_code: CountryCode.FR,
      is_latest: true,
      name: 'Nancy - Tous les arrêts, Grand Est, France',
      longitude: 6.1444727044,
      latitude: 48.6484863111,
      type: GroundPlaceType.CLUSTER,
    },
  ];

  it('should return all places if the search is empty', () => {
    const groundPlaces: AutoComplete[] = storageService.searchGroundPlaces(groundPlacesAutocomplete, '');

    expect(groundPlaces).toStrictEqual(groundPlacesAutocomplete);
  });

  it('should return places based on name', () => {
    const groundPlaces: AutoComplete[] = storageService.searchGroundPlaces(
      groundPlacesAutocomplete,
      'Strasbourg Roethig',
    );

    expect(groundPlaces).toStrictEqual([
      {
        gpuid: 'g|FRstraroet@u0tkr3',
        childs: [
          {
            unique_name: null,
            company_name: 'vsc',
            name: 'Strasbourg Roethig',
            latitude: 48.569,
            serviced: GroundPlaceServiced.FALSE,
            company_id: 10,
            longitude: 7.704,
            id: 'FRBUK',
          },
        ],
        name: 'Strasbourg Roethig',
        longitude: 7.704,
        serviced: GroundPlaceServiced.FALSE,
        has_been_modified: false,
        warning: false,
        country_code: CountryCode.FR,
        latitude: 48.569,
        is_latest: true,
        type: GroundPlaceType.GROUP,
      },
    ]);
  });

  it('should return places based on Gpuid', () => {
    const groundPlaces: AutoComplete[] = storageService.searchGroundPlaces(groundPlacesAutocomplete, 'FRstrasbou');

    expect(groundPlaces).toStrictEqual([
      {
        gpuid: 'c|FRstrasbou@u0ts2',
        unique_name: 'strasbourg',
        childs: ['g|FRstrasbou@u0tkru', 'g|FRstraroet@u0tkr3'],
        serviced: GroundPlaceServiced.FALSE,
        has_been_modified: false,
        warning: false,
        country_code: CountryCode.FR,
        is_latest: true,
        name: 'Strasbourg, Grand-Est, France',
        longitude: 7.74815,
        latitude: 48.583,
        type: GroundPlaceType.CLUSTER,
      },
      {
        gpuid: 'g|FRstrasbou@u0tkru',
        childs: [
          {
            unique_name: null,
            company_name: 'flixbus',
            name: 'Strasbourg',
            latitude: 48.574179,
            serviced: GroundPlaceServiced.FALSE,
            company_id: 5,
            longitude: 7.754266,
            id: '23',
          },
        ],
        name: 'Strasbourg',
        longitude: 7.73417,
        serviced: GroundPlaceServiced.FALSE,
        has_been_modified: false,
        warning: false,
        country_code: CountryCode.FR,
        latitude: 48.58392,
        is_latest: true,
        type: GroundPlaceType.GROUP,
      },
    ]);
  });

  it('should return places based on unique name', () => {
    const groundPlaces: AutoComplete[] = storageService.searchGroundPlaces(groundPlacesAutocomplete, 'nancy---');

    expect(groundPlaces).toStrictEqual([
      {
        gpuid: 'c|FRnaarto__@u0skg',
        unique_name: 'nancy---tous-les-arrets',
        childs: [],
        serviced: GroundPlaceServiced.FALSE,
        has_been_modified: false,
        warning: false,
        country_code: CountryCode.FR,
        is_latest: true,
        name: 'Nancy - Tous les arrêts, Grand Est, France',
        longitude: 6.1444727044,
        latitude: 48.6484863111,
        type: GroundPlaceType.CLUSTER,
      },
    ]);
  });
});
