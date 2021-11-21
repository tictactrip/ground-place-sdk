import { GroundPlacesController } from '../../src/classes/groundplaces';
import * as mockSmallGroundPlacesFile from '../../mocks/smallGroundPlacesFile.json';
import { CountryCode, GroundPlacesFile, CreateGroundPlacesParams } from '../../src/types';

describe('#createStopCluster', () => {
  const groundPlacesService: GroundPlacesController = new GroundPlacesController();

  it('should create a new StopCluster', () => {
    groundPlacesService.init(mockSmallGroundPlacesFile as GroundPlacesFile);

    const createStopClusterProperties = {
      countryCode: CountryCode.FR,
      name: 'Strasbourg - Wolfisheim',
      latitude: 48.5857122,
      longitude: 7.6275127,
    };
    const fromStopGroupGpuid = 'g|FRststbi__@u0tkxd';

    groundPlacesService.createStopCluster(fromStopGroupGpuid, createStopClusterProperties);

    expect(groundPlacesService.getGroundPlaces()).toStrictEqual([
      {
        gpuid: 'c|FRstrasbou@u0ts2',
        unique_name: 'strasbourg',
        childs: ['g|FRststbi__@u0tkxd'],
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
      },
      {
        gpuid: 'c|FRstrawolf@u0tkm',
        childs: ['g|FRststbi__@u0tkxd'],
        serviced: 'False',
        country_code: 'fr',
        name: 'Strasbourg - Wolfisheim',
        longitude: 7.6275127,
        latitude: 48.5857122,
        is_latest: true,
        type: 'cluster',
        unique_name: null,
      },
    ]);
    expect(groundPlacesService.getGroundPlacesActionHistory()).toStrictEqual([
      {
        'g|FRststbi__@u0tkxd': {
          type: 'createStopCluster',
          params: {
            countryCode: 'fr',
            gpuid: 'c|FRstrawolf@u0tkm',
            name: 'Strasbourg - Wolfisheim',
            latitude: 48.5857122,
            longitude: 7.6275127,
          },
        },
      },
    ]);
  });

  it('should throw an error if the new StopCluster is far away from the current StopCluster parent (beyond 70km)', () => {
    groundPlacesService.init(mockSmallGroundPlacesFile as GroundPlacesFile);

    let thrownError: Error;

    try {
      const createStopClusterProperties = {
        countryCode: CountryCode.FR,
        name: 'Strasbourg - Wolfisheim',
        latitude: 100,
        longitude: 50,
      };
      const fromStopGroupGpuid = 'g|FRststbi__@u0tkxd';

      groundPlacesService.createStopCluster(fromStopGroupGpuid, createStopClusterProperties);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new Error(
        'You can\'t attach the StopGroup with the Gpuid "g|FRststbi__@u0tkxd" to the StopCluster with the Gpuid "c|FRstrawolf@vpgxc" because they are "5466.21km" away (the limit is 70km).',
      ),
    );
  });

  it('should throw an error if the current StopGroup is not found', () => {
    groundPlacesService.init(mockSmallGroundPlacesFile as GroundPlacesFile);

    let thrownError: Error;

    try {
      const createStopClusterProperties = {
        countryCode: CountryCode.FR,
        name: 'Strasbourg - Wolfisheim',
        latitude: 100,
        longitude: 50,
      };
      const fromStopGroupGpuid = 'g|FRststbi__@u0tkxdd';

      groundPlacesService.createStopCluster(fromStopGroupGpuid, createStopClusterProperties);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(new Error('The StopGroup with the Gpuid "g|FRststbi__@u0tkxdd" is not found.'));
  });

  it('should throw an error if there is missing values', () => {
    groundPlacesService.init(mockSmallGroundPlacesFile as GroundPlacesFile);

    let thrownError: Error;

    try {
      const createStopClusterProperties = {
        countryCode: CountryCode.FR,
        latitude: 100,
        longitude: 50,
      };
      const fromStopGroupGpuid = 'g|FRststbi__@u0tkxdd';

      groundPlacesService.createStopCluster(
        fromStopGroupGpuid,
        createStopClusterProperties as CreateGroundPlacesParams,
      );
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new Error(
        'Error while creating a new StopCluster, please check that you have provide all properties needed (fromStopGroupGpuid, countryCode, latitude, longitude and name).',
      ),
    );
  });
});
