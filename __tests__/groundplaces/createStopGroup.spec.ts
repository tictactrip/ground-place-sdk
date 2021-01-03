import { GroundPlacesController } from '../../src/classes/groundplaces';
import * as mockSmallGroundPlacesFile from '../../mocks/smallGroundPlacesFile.json';
import { CountryCode, GroundPlacesFile } from '../../src/types';

describe('#createStopGroup', () => {
  const groundPlacesService: GroundPlacesController = new GroundPlacesController();

  it('should create a new StopGroup', () => {
    groundPlacesService.init(mockSmallGroundPlacesFile as GroundPlacesFile);

    const createStopGroupProperties = {
      countryCode: CountryCode.FR,
      name: 'Strasbourg - Wolfisheim',
      latitude: 48.5857122,
      longitude: 7.6275127,
    };
    const fromStopGroupGpuid = 'g|FRststbi__@u0tkxd';
    const segmentProviderStopId = '19528';

    groundPlacesService.createStopGroup(segmentProviderStopId, fromStopGroupGpuid, createStopGroupProperties);

    expect(groundPlacesService.getGroundPlaces()).toEqual([
      {
        gpuid: 'c|FRstrasbou@u0ts2',
        unique_name: 'strasbourg',
        childs: ['g|FRststbi__@u0tkxd', 'g|FRstrawolf@u0tkms'],
        serviced: 'True',
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
        gpuid: 'g|FRststbi__@u0tkxd',
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
        name: 'Strasbourg - Wolfisheim',
        longitude: 7.6275127,
        latitude: 48.5857122,
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
  });

  it('should throw an error if the new StopGroup is far away from one of its StopCluster parent (beyond 70km)', () => {
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
        'You can\'t attach the StopGroup with the Gpuid "g|FRstrawolf@y0zh7w" to the StopCluster with the Gpuid "c|FRstrasbou@u0ts2" because they are "6237.92km" away (the limit is 70km).',
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
});
