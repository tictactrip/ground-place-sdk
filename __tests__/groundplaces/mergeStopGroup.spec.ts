import { GroundPlacesController } from '../../src/classes/groundplaces';
import * as verylargeGroundPlacesFile from '../../mocks/verylargeGroundPlacesFile.json';
import { GroundPlacesFile } from '../../src/types';

describe('#mergeStopGroup', () => {
  it('should merge two StopGroup', () => {
    const groundPlacesService: GroundPlacesController = new GroundPlacesController();

    groundPlacesService.init(verylargeGroundPlacesFile as GroundPlacesFile);

    const stopGroupToMergeGpuid = 'g|FRstrasbou@u0tkru';
    const intoStopGroupGpuid = 'g|FRststbi__@u0tkxd';

    groundPlacesService.mergeStopGroup(stopGroupToMergeGpuid, intoStopGroupGpuid);

    expect(groundPlacesService.getGroundPlaces()).toStrictEqual([
      {
        gpuid: 'c|FRstrasbou@u0ts2',
        unique_name: 'strasbourg',
        childs: ['g|FRststbi__@u0tkxd', 'g|FRstraroet@u0tkr3'],
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
        childs: ['g|FRnancy___@u0skux'],
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
  });

  it('should delete the StopGroup to merge', () => {
    const groundPlacesService: GroundPlacesController = new GroundPlacesController();

    groundPlacesService.init(verylargeGroundPlacesFile as GroundPlacesFile);

    const stopGroupToMergeGpuid = 'g|FRststbi__@u0tkxd';
    const intoStopGroupGpuid = 'g|FRnanvanna@u0skgb';

    groundPlacesService.mergeStopGroup(stopGroupToMergeGpuid, intoStopGroupGpuid);

    expect(groundPlacesService.getGroundPlaces()).toStrictEqual([
      {
        gpuid: 'c|FRstrasbou@u0ts2',
        unique_name: 'strasbourg',
        childs: ['g|FRstraroet@u0tkr3'],
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
        childs: ['g|FRnancy___@u0skux'],
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
  });

  it('should throw an error if the two StopGroup to merge are the same', () => {
    const groundPlacesService: GroundPlacesController = new GroundPlacesController();

    groundPlacesService.init(verylargeGroundPlacesFile as GroundPlacesFile);

    const stopGroupToMergeGpuid = 'g|FRstrasbou@u0tkru';
    const intoStopGroupGpuid = 'g|FRstrasbou@u0tkru';

    let thrownError: Error;

    try {
      groundPlacesService.mergeStopGroup(stopGroupToMergeGpuid, intoStopGroupGpuid);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new Error(
        'You can\'t "merge" these two StopGroup with the Gpuid "g|FRstrasbou@u0tkru" because they are the same.',
      ),
    );
  });

  it('should throw an error if the StopGroup to merge is not found', () => {
    const groundPlacesService: GroundPlacesController = new GroundPlacesController();

    groundPlacesService.init(verylargeGroundPlacesFile as GroundPlacesFile);

    const stopGroupToMergeGpuid = 'g|FRstrasbou@u0tkruu';
    const intoStopGroupGpuid = 'g|FRstrasbou@u0tkru';

    let thrownError: Error;

    try {
      groundPlacesService.mergeStopGroup(stopGroupToMergeGpuid, intoStopGroupGpuid);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(new Error('The StopGroup with the Gpuid "g|FRstrasbou@u0tkruu" is not found.'));
  });

  it('should throw an error if the StopGroup to be merged is not found', () => {
    const groundPlacesService: GroundPlacesController = new GroundPlacesController();

    groundPlacesService.init(verylargeGroundPlacesFile as GroundPlacesFile);

    const stopGroupToMergeGpuid = 'g|FRstrasbou@u0tkru';
    const intoStopGroupGpuid = 'g|FRstrasbou@u0tkruu';

    let thrownError: Error;

    try {
      groundPlacesService.mergeStopGroup(stopGroupToMergeGpuid, intoStopGroupGpuid);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(new Error('The StopGroup with the Gpuid "g|FRstrasbou@u0tkruu" is not found.'));
  });
});
