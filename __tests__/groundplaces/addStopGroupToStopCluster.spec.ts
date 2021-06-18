import { GroundPlacesController } from '../../src/classes/groundplaces';
import * as mockVerylargeGroundPlacesFile from '../../mocks/verylargeGroundPlacesFile.json';
import { GroundPlacesFile } from '../../src/types';

describe('#addStopGroupToStopCluster', () => {
  it('should add StopGroup to a StopCluster', () => {
    const groundPlacesService: GroundPlacesController = new GroundPlacesController();

    groundPlacesService.init(mockVerylargeGroundPlacesFile as GroundPlacesFile);
    groundPlacesService.addStopGroupToStopCluster('g|FRnanvanna@u0skgb', 'c|FRnancy___@u0sku');

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
        address: '99999 Rue du Triage, 67800 Bischheim, France',
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
        address: '22 Place de la Gare, 67000 Strasbourg, France',
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
        address: '1 Quai du Roethig, 67000 Strasbourg, France',
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
        childs: ['g|FRnanvanna@u0skgb', 'g|FRnancy___@u0skux'],
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
      {
        gpuid: 'g|FRnanvanna@u0skgb',
        childs: [
          {
            unique_name: null,
            company_name: 'flixbus',
            name: 'Nancy, Vandoeuvre-les-Nancy',
            latitude: 48.648395,
            serviced: 'True',
            company_id: 5,
            longitude: 6.144364,
            id: '19518',
          },
        ],
        address: '6 Avenue de Bourgogne, 54500 Vandœuvre-lès-Nancy, France',
        name: 'Nancy, Vandoeuvre-les-Nancy',
        longitude: 6.144364,
        serviced: 'True',
        has_been_modified: false,
        warning: false,
        country_code: 'fr',
        latitude: 48.648395,
        is_latest: true,
        type: 'group',
      },
      {
        gpuid: 'c|FRnancy___@u0sku',
        unique_name: 'nancy',
        childs: ['g|FRnancy___@u0skux', 'g|FRnanvanna@u0skgb'],
        serviced: 'True',
        has_been_modified: false,
        warning: false,
        country_code: 'fr',
        is_latest: true,
        name: 'Nancy, Grand-Est, France',
        longitude: 6.184417,
        latitude: 48.692054,
        type: 'cluster',
      },
      {
        gpuid: 'g|FRnancy___@u0skux',
        childs: [],
        address: 'Gare de Nancy-Ville, Avenue Foch, 54100 Nancy, France',
        name: 'Nancy',
        longitude: 6.1744,
        serviced: 'True',
        has_been_modified: false,
        warning: false,
        country_code: 'fr',
        latitude: 48.6899,
        is_latest: true,
        type: 'group',
      },
    ]);
    expect(groundPlacesService.getGroundPlacesActionHistory()).toStrictEqual([
      {
        'g|FRnanvanna@u0skgb': {
          type: 'addStopGroupToStopCluster',
          into: 'c|FRnancy___@u0sku',
        },
      },
    ]);
  });

  it('should throw an error if the StopGroup to add is far away from the new StopCluster parent', () => {
    const groundPlacesService: GroundPlacesController = new GroundPlacesController();

    groundPlacesService.init(mockVerylargeGroundPlacesFile as GroundPlacesFile);

    let thrownError: Error;

    try {
      groundPlacesService.addStopGroupToStopCluster('g|FRststbi__@u0tkxd', 'c|FRnaarto__@u0skg');
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new Error(
        'You can\'t attach the StopGroup with the Gpuid "g|FRststbi__@u0tkxd" to the StopCluster with the Gpuid "c|FRnaarto__@u0skg" because they are "115.82km" away (the limit is 70km).',
      ),
    );
  });

  it('should throw an error if the StopGroup to add does not exist', () => {
    const groundPlacesService: GroundPlacesController = new GroundPlacesController();

    groundPlacesService.init(mockVerylargeGroundPlacesFile as GroundPlacesFile);

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
    groundPlacesService.init(mockVerylargeGroundPlacesFile as GroundPlacesFile);

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

    groundPlacesService.init(mockVerylargeGroundPlacesFile as GroundPlacesFile);

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
