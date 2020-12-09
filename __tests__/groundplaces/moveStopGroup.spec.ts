import { GroundPlacesController } from '../../src/classes/groundplaces';
import * as largeGroundPlacesFile from '../../mocks/largeGroundPlacesFile.json';
import { GroundPlacesFile } from '../../src/types';

describe('#moveStopGroup', () => {
  const groundPlacesService: GroundPlacesController = new GroundPlacesController();
  groundPlacesService.init(largeGroundPlacesFile as GroundPlacesFile);

  it('should move the desired StopGroup to the StopCluster specified', () => {
    const stopGroupToMoveGpuid = 'g|FRststbi__@u0tkxd';
    const fromStopClusterGpuid = 'c|FRstrasbou@u0ts2';
    const intoStopClusterGpuid = 'c|FRnaarto__@u0skg';

    groundPlacesService.moveStopGroup(stopGroupToMoveGpuid, fromStopClusterGpuid, intoStopClusterGpuid);

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

  it('should throw an error if the StopGroup to move does not belong to the StopCluster parent specified', () => {
    const stopGroupToMoveGpuid = 'g|FRstrasbou@u0tkru';
    const fromStopClusterGpuid = 'c|FRnaarto__@u0skg';
    const intoStopClusterGpuid = 'c|FRstrasbou@u0ts2';

    let thrownError: Error;

    try {
      groundPlacesService.moveStopGroup(stopGroupToMoveGpuid, fromStopClusterGpuid, intoStopClusterGpuid);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new Error(
        'The StopGroup with the Gpuid "g|FRstrasbou@u0tkru" cannot be removed from the StopCluster with the Gpuid "c|FRnaarto__@u0skg" because it does not belong to it.',
      ),
    );
  });

  it('should throw an error if the StopCluster parent is not found', () => {
    const stopGroupToMoveGpuid = 'g|FRststbi__@u0tkxd';
    const fromStopClusterGpuid = 'c|FRnaarto__@u0skgg';
    const intoStopClusterGpuid = 'c|FRstrasbou@u0ts2';

    let thrownError: Error;

    try {
      groundPlacesService.moveStopGroup(stopGroupToMoveGpuid, fromStopClusterGpuid, intoStopClusterGpuid);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(new Error('The StopCluster with the Gpuid "c|FRnaarto__@u0skgg" is not found.'));
  });

  it('should throw an error if the new StopCluster parent is not found', () => {
    const stopGroupToMoveGpuid = 'g|FRststbi__@u0tkxd';
    const fromStopClusterGpuid = 'c|FRnaarto__@u0skg';
    const intoStopClusterGpuid = 'c|FRstrasbou@u0ts22';

    let thrownError: Error;

    try {
      groundPlacesService.moveStopGroup(stopGroupToMoveGpuid, fromStopClusterGpuid, intoStopClusterGpuid);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(new Error('The StopCluster with the Gpuid "c|FRstrasbou@u0ts22" is not found.'));
  });

  it('should throw an error if the new StopCluster is the same as the StopCluster parent used', () => {
    const stopGroupToMoveGpuid = 'g|FRststbi__@u0tkxd';
    const fromStopClusterGpuid = 'c|FRnaarto__@u0skg';
    const intoStopClusterGpuid = 'c|FRnaarto__@u0skg';

    let thrownError: Error;

    try {
      groundPlacesService.moveStopGroup(stopGroupToMoveGpuid, fromStopClusterGpuid, intoStopClusterGpuid);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new Error(
        `You can't move the StopGroup with the Gpuid "g|FRststbi__@u0tkxd" because it already exists inside the new StopCluster parent specified.`,
      ),
    );
  });
});
