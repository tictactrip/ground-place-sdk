import { GroundPlacesController } from '../../src/classes/groundplaces';
import * as mockSmallGroundPlacesFile from '../../mocks/smallGroundPlacesFile.json';
import { GroundPlacesFile } from '../../src/types';

describe('#updateStopCluster', () => {
  it('should not update the name of the StopCluster and throw error', () => {
    const groundPlacesService: GroundPlacesController = new GroundPlacesController();
    let thrownError: Error;
    groundPlacesService.init(mockSmallGroundPlacesFile as GroundPlacesFile);

    try {
      groundPlacesService.updateStopCluster('c|FRstrasbou@u0ts2', { name: 'Strasbourg, Hauts-de-france France' });
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new Error(
        'The StopCluster name you entered (Strasbourg, Hauts-de-france France) does not respect the following format: CITY, REGION, COUNTRY, please correct!',
      ),
    );
  });

  it('should update the name of the StopCluster', () => {
    const groundPlacesService: GroundPlacesController = new GroundPlacesController();

    groundPlacesService.init(mockSmallGroundPlacesFile as GroundPlacesFile);

    groundPlacesService.updateStopCluster('c|FRstrasbou@u0ts2', { name: 'Strasbourg, Est, France' });

    expect(groundPlacesService.getGroundPlaces()).toStrictEqual([
      {
        gpuid: 'c|FRstrasbou@u0ts2',
        unique_name: 'strasbourg',
        childs: ['g|FRststbi__@u0tkxd'],
        serviced: 'True',
        has_been_modified: false,
        warning: false,
        country_code: 'fr',
        is_high_speed: true,
        is_latest: true,
        name: 'Strasbourg, Est, France',
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
    ]);
  });

  it('should throw an error if one property passed is undefined', () => {
    const groundPlacesService: GroundPlacesController = new GroundPlacesController();

    groundPlacesService.init(mockSmallGroundPlacesFile as GroundPlacesFile);

    let thrownError: Error;

    try {
      groundPlacesService.updateStopCluster('c|FRstrasbou@u0ts2', {
        name: 'Strasbourg, Est, France',
        longitude: undefined,
      });
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new Error(
        'You can\'t update the "cluster" with the Gpuid "c|FRstrasbou@u0ts2" because the property named "longitude" is undefined.',
      ),
    );
  });

  it('should throw an error if the new position of the updated StopCluster is far away from one of its StopGroup childs (limit is 70km)', () => {
    const groundPlacesService: GroundPlacesController = new GroundPlacesController();

    groundPlacesService.init(mockSmallGroundPlacesFile as GroundPlacesFile);

    let thrownError: Error;

    try {
      groundPlacesService.updateStopCluster('c|FRstrasbou@u0ts2', {
        name: 'Strasbourg, Est, France',
        latitude: 100,
        longitude: 50,
      });
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new Error(
        'You can\'t update the StopCluster with the Gpuid "c|FRstrasbou@u0ts2" because it\'s "5466.21km" away from the StopGroup children with the Gpuid "g|FRststbi__@u0tkxd" (the limit is 70km).',
      ),
    );
  });

  it('should thrown an error if the new name of the StopCluster is empty', () => {
    const groundPlacesService: GroundPlacesController = new GroundPlacesController();

    groundPlacesService.init(mockSmallGroundPlacesFile as GroundPlacesFile);

    let thrownError: Error;

    try {
      groundPlacesService.updateStopCluster('c|FRstrasbou@u0ts2', {
        name: '',
      });
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new Error(
        'You can\'t update the "cluster" named "Strasbourg, Grand-Est, France" because the new name defined is empty.',
      ),
    );
  });
});
