import { GroundPlacesController } from '../../src/classes/groundplaces';
import * as mockSmallGroundPlacesFile from '../../mocks/smallGroundPlacesFile.json';
import { GroundPlacesFile } from '../../src/types';

describe('#updateStopGroup', () => {
  it('should update the name of the StopGroup', () => {
    const groundPlacesService: GroundPlacesController = new GroundPlacesController();

    groundPlacesService.init(mockSmallGroundPlacesFile as GroundPlacesFile);

    groundPlacesService.updateStopGroup('g|FRststbi__@u0tkxd', { name: 'Strasbourg, Grand-Est, France' });

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
        name: 'Strasbourg, Grand-Est, France',
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

  it('should be able to use any latitude and longitude values if the StopGroup did not have StopCluster parent', () => {
    const groundPlacesService: GroundPlacesController = new GroundPlacesController();

    groundPlacesService.init(mockSmallGroundPlacesFile as GroundPlacesFile);

    groundPlacesService.updateStopGroup('g|FRststbi__@u0tkxd', { name: 'Strasbourg, Grand-Est, France' });

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
        name: 'Strasbourg, Grand-Est, France',
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
      groundPlacesService.updateStopGroup('g|FRststbi__@u0tkxd', {
        name: 'Strasbourg, Grand-Est, France',
        latitude: undefined,
      });
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new Error(
        'You can\'t update the "group" with the Gpuid "g|FRststbi__@u0tkxd" because the property named "latitude" is undefined.',
      ),
    );
  });

  it('should throw an error if the new position of the updated StopGroup is far away from its StopCluster parent', () => {
    const groundPlacesService: GroundPlacesController = new GroundPlacesController();

    groundPlacesService.init(mockSmallGroundPlacesFile as GroundPlacesFile);

    let thrownError: Error;

    try {
      groundPlacesService.updateStopGroup('g|FRststbi__@u0tkxd', { latitude: 50 });
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toStrictEqual(
      new Error(
        'You can\'t update the StopGroup with the Gpuid "g|FRststbi__@u0tkxd" because it\'s "157.58km" away from the current StopCluster parent (the limit is 70km).',
      ),
    );
  });
});
