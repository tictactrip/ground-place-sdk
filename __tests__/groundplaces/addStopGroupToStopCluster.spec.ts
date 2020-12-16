import { GroundPlacesController } from '../../src/classes/groundplaces';
import * as largeGroundPlacesFile from '../../mocks/largeGroundPlacesFile.json';
import { GroundPlacesFile } from '../../src/types';

describe('#addStopGroupToStopCluster', () => {
  it('should add StopGroup to a StopCluster', () => {
    const groundPlacesService: GroundPlacesController = new GroundPlacesController();

    groundPlacesService.init(largeGroundPlacesFile as GroundPlacesFile);
    groundPlacesService.addStopGroupToStopCluster('g|FRststbi__@u0tkxd', 'c|FRnaarto__@u0skg');

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
      {
        gpuid: 'c|FRnaarto__@u0skg',
        unique_name: 'nancy---tous-les-arrets',
        childs: ['g|FRststbi__@u0tkxd'],
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

  it('should throw an error if the StopGroup to add does not exist', () => {
    const groundPlacesService: GroundPlacesController = new GroundPlacesController();

    groundPlacesService.init(largeGroundPlacesFile as GroundPlacesFile);

    let thrownError: Error;

    try {
      groundPlacesService.addStopGroupToStopCluster('g|FRststbi__@u0tkxdd', 'c|FRnaarto__@u0skg');
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(new Error('The StopGroup with the Gpuid "g|FRststbi__@u0tkxdd" is not found.'));
  });

  it('should throw an error if the new StopCluster parent does not exist', () => {
    const groundPlacesService: GroundPlacesController = new GroundPlacesController();
    groundPlacesService.init(largeGroundPlacesFile as GroundPlacesFile);

    let thrownError: Error;

    try {
      groundPlacesService.addStopGroupToStopCluster('g|FRststbi__@u0tkxd', 'c|FRnaarto__@u0skgg');
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(new Error('The StopCluster with the Gpuid "c|FRnaarto__@u0skgg" is not found.'));
  });

  it('should throw an error if the StopGroup to add already belong to the new StopCluster', () => {
    const groundPlacesService: GroundPlacesController = new GroundPlacesController();

    groundPlacesService.init(largeGroundPlacesFile as GroundPlacesFile);

    let thrownError: Error;

    try {
      groundPlacesService.addStopGroupToStopCluster('g|FRststbi__@u0tkxd', 'c|FRstrasbou@u0ts2');
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new Error(
        'The StopGroup with the Gpuid "g|FRststbi__@u0tkxd" cannot be added to the StopCluster with the Gpuid "c|FRstrasbou@u0ts2" because it already exists in it.',
      ),
    );
  });
});
