import { GroundPlacesController } from '../../src/classes/groundplaces';
import * as largeGroundPlacesFile from '../../mocks/largeGroundPlacesFile.json';
import { GroundPlacesFile } from '../../src/types';

describe('#deleteStopCluster', () => {
  const groundPlacesService: GroundPlacesController = new GroundPlacesController();
  groundPlacesService.init(largeGroundPlacesFile as GroundPlacesFile);

  it('should delete the StopCluster if its empty (no childs) and the Gpuid exist', () => {
    groundPlacesService.deleteStopCluster('c|FRnaarto__@u0skg');

    expect(groundPlacesService.getGroundPlaces()).toStrictEqual([
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
        gpuid: 'g|FRststbi__@u0tkxd',
        childs: [],
        name: 'Strasbourg, Strasbourg - Bischheim',
        longitude: 7.719863,
        serviced: 'False',
        has_been_modified: false,
        warning: false,
        country_code: 'fr',
        latitude: 48.616228,
        is_latest: true,
        type: 'group',
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

  it('should throw an error if the StopCluster to delete has children', () => {
    let thrownError: Error;

    try {
      groundPlacesService.deleteStopCluster('c|FRstrasbou@u0ts2');
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new Error('The "cluster" with the Gpuid "c|FRstrasbou@u0ts2" cannot be deleted because it has children.'),
    );
  });

  it('should throw an error if the StopCluster to delete is not found', () => {
    let thrownError: Error;

    try {
      groundPlacesService.deleteStopCluster('c|FRstrasbou@u0ts22');
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new Error('The "cluster" with the Gpuid "c|FRstrasbou@u0ts22" cannot be deleted because it cannot be found.'),
    );
  });

  it('should throw an error if the StopCluster to delete is not a StopCluster', () => {
    let thrownError: Error;

    try {
      groundPlacesService.deleteStopCluster('g|FRststbi__@u0tkxd');
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new Error('The "cluster" with the Gpuid "g|FRststbi__@u0tkxd" cannot be deleted because it cannot be found.'),
    );
  });
});
