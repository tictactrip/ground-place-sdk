import { GroundPlacesController } from '../../src/classes/groundplaces';
import * as largeGroundPlacesFile from '../../mocks/largeGroundPlacesFile.json';
import { GroundPlacesFile } from '../../src/types';

describe('#deleteStopGroup', () => {
  const groundPlacesService: GroundPlacesController = new GroundPlacesController();
  groundPlacesService.init(largeGroundPlacesFile as GroundPlacesFile);

  it('should delete the StopGroup if its empty (no childs) and the Gpuid exist and remove reference inside its StopCluster parent', () => {
    groundPlacesService.deleteStopGroup('g|FRststbi__@u0tkxd');

    expect(groundPlacesService.getGroundPlaces()).toStrictEqual([
      {
        gpuid: 'c|FRstrasbou@u0ts2',
        unique_name: 'strasbourg',
        childs: ['g|FRstrasbou@u0tkru', 'g|FRstraroet@u0tkr3'],
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

  it('should throw an error if the StopGroup to delete has children', () => {
    let thrownError: Error;

    try {
      groundPlacesService.deleteStopGroup('g|FRstrasbou@u0tkru');
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new Error('The "group" with the Gpuid "g|FRstrasbou@u0tkru" cannot be deleted because it has children.'),
    );
  });

  it('should throw an error if the StopGroup to delete is not found', () => {
    let thrownError: Error;

    try {
      groundPlacesService.deleteStopGroup('g|FRstrasbou@u0tkruu');
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new Error('The "group" with the Gpuid "g|FRstrasbou@u0tkruu" cannot be deleted because it cannot be found.'),
    );
  });

  it('should throw an error if the StopGroup to delete is not a StopGroup', () => {
    let thrownError: Error;

    try {
      groundPlacesService.deleteStopGroup('c|FRnaarto__@u0skg');
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new Error('The "group" with the Gpuid "c|FRnaarto__@u0skg" cannot be deleted because it cannot be found.'),
    );
  });
});
