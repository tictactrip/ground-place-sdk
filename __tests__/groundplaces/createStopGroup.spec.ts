import { GroundPlacesController } from '../../src/classes/groundplaces';
import * as mockSmallGroundPlacesFile from '../../mocks/smallGroundPlacesFile.json';
import { CountryCode, GroundPlacesFile, CreateGroundPlacesParams } from '../../src/types';

describe('#createStopGroup', () => {
  const groundPlacesService: GroundPlacesController = new GroundPlacesController();

  it('should create a new StopGroup', () => {
    groundPlacesService.init(mockSmallGroundPlacesFile as GroundPlacesFile);

    const createStopGroupProperties = {
      countryCode: CountryCode.FR,
      name: 'Strasbourg - Wolfisheim',
      latitude: 48.5857122,
      longitude: 7.6275127,
      address: 'Strasbourg, France',
    };
    const fromStopGroupGpuid = 'g|FRststbi__@u0tkxd';
    const segmentProviderStopId = '19528';

    groundPlacesService.createStopGroup(segmentProviderStopId, fromStopGroupGpuid, createStopGroupProperties);

    expect(groundPlacesService.getGroundPlaces()).toStrictEqual([
      {
        gpuid: 'c|FRstrasbou@u0ts2',
        unique_name: 'strasbourg',
        childs: ['g|FRststbi__@u0tkxd', 'g|FRstrawolf@u0tkms'],
        serviced: 'True',
        has_been_modified: false,
        warning: false,
        country_code: 'fr',
        is_latest: true,
        is_high_speed: true,
        name: 'Strasbourg, Grand-Est, France',
        longitude: 7.74815,
        latitude: 48.583,
        type: 'cluster',
      },
      {
        gpuid: 'g|FRststbi__@u0tkxd',
        address: '99999 Rue du Triage, 67800 Bischheim, France',
        name: 'Strasbourg, Strasbourg - Bischheim',
        longitude: 7.719863,
        serviced: 'True',
        has_been_modified: false,
        warning: false,
        country_code: 'fr',
        latitude: 48.616228,
        is_latest: true,
        type: 'group',
        childs: [],
      },
      {
        gpuid: 'g|FRstrawolf@u0tkms',
        address: 'Strasbourg, France',
        name: 'Strasbourg - Wolfisheim',
        longitude: 7.6275127,
        latitude: 48.5857122,
        is_latest: true,
        country_code: 'fr',
        type: 'group',
        serviced: 'False',
        childs: [
          {
            unique_name: null,
            company_name: 'flixbus',
            name: 'Strasbourg, Strasbourg - Bischheim',
            latitude: 48.616228,
            serviced: 'True',
            company_id: 5,
            longitude: 7.719863,
            id: '19528',
          },
        ],
      },
    ]);
    expect(groundPlacesService.getGroundPlacesActionHistory()).toStrictEqual([
      {
        'g|FRststbi__@u0tkxd': {
          type: 'createStopGroup',
          params: {
            segmentProviderStopId: '19528',
            countryCode: 'fr',
            gpuid: 'g|FRstrawolf@u0tkms',
            name: 'Strasbourg - Wolfisheim',
            latitude: 48.5857122,
            longitude: 7.6275127,
            address: 'Strasbourg, France',
          },
        },
      },
    ]);
  });

  it('should throw an error if the new StopGroup is far away from its SegmentProviderStop children (beyond 70km)', () => {
    groundPlacesService.init(mockSmallGroundPlacesFile as GroundPlacesFile);

    let thrownError: Error;

    try {
      const createStopGroupProperties = {
        countryCode: CountryCode.FR,
        name: 'Strasbourg - Wolfisheim',
        latitude: 50,
        longitude: 100,
      };
      const fromStopGroupGpuid = 'g|FRststbi__@u0tkxd';
      const segmentProviderStopId = '19528';

      groundPlacesService.createStopGroup(segmentProviderStopId, fromStopGroupGpuid, createStopGroupProperties);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new Error(
        'You can\'t move the SegmentProviderStop with the ID "19528" inside the StopGroup with the Gpuid "g|FRstrawolf@y0zh7w" because they are "6237.19km" away (the limit is 70km).',
      ),
    );
  });

  it('should throw an error if the fromStopGroupGpuid parent is not found', () => {
    groundPlacesService.init(mockSmallGroundPlacesFile as GroundPlacesFile);

    let thrownError: Error;

    try {
      const createStopGroupProperties = {
        countryCode: CountryCode.FR,
        name: 'Strasbourg - Wolfisheim',
        latitude: 50,
        longitude: 100,
      };
      const fromStopGroupGpuid = 'g|FRststbi__@u0tkxdddd';
      const segmentProviderStopId = '19528';

      groundPlacesService.createStopGroup(segmentProviderStopId, fromStopGroupGpuid, createStopGroupProperties);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(new Error('The StopGroup with the Gpuid "g|FRststbi__@u0tkxdddd" is not found.'));
  });

  it('should throw an error if the segmentProviderStop is not found', () => {
    groundPlacesService.init(mockSmallGroundPlacesFile as GroundPlacesFile);

    let thrownError: Error;

    try {
      const createStopGroupProperties = {
        countryCode: CountryCode.FR,
        name: 'Strasbourg - Wolfisheim',
        latitude: 50,
        longitude: 100,
      };
      const fromStopGroupGpuid = 'g|FRststbi__@u0tkxd';
      const segmentProviderStopId = '1952888';

      groundPlacesService.createStopGroup(segmentProviderStopId, fromStopGroupGpuid, createStopGroupProperties);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new Error(
        'The SegmentProviderStop with the ID "1952888" doesn\'t exists inside the StopGroup with the Gpuid "g|FRststbi__@u0tkxd".',
      ),
    );
  });

  it('should throw an error if there is missing values', () => {
    groundPlacesService.init(mockSmallGroundPlacesFile as GroundPlacesFile);

    let thrownError: Error;

    try {
      const createStopGroupProperties = {
        countryCode: CountryCode.FR,
        name: 'Strasbourg - Wolfisheim',
        latitude: 50,
      };
      const fromStopGroupGpuid = 'g|FRststbi__@u0tkxd';
      const segmentProviderStopId = '1952888';

      groundPlacesService.createStopGroup(
        segmentProviderStopId,
        fromStopGroupGpuid,
        createStopGroupProperties as CreateGroundPlacesParams,
      );
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new Error(
        'Error while creating a new StopGroup, please check that you have provide all properties needed (segmentProviderId, fromStopGroupGpuid, countryCode, latitude, longitude and name).',
      ),
    );
  });
});
