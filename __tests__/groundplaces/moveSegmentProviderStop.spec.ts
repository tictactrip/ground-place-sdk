import { GroundPlacesController } from '../../src/classes/groundplaces';
import * as largeGroundPlacesFile from '../../mocks/largeGroundPlacesFile.json';
import { GroundPlacesFile } from '../../src/types';

describe('#moveSegmentProviderStop', () => {
  it('should move the SegmentProviderStop specified to a new StopGroup', () => {
    const groundPlacesService: GroundPlacesController = new GroundPlacesController();

    groundPlacesService.init(largeGroundPlacesFile as GroundPlacesFile);

    const segmentProviderStopId = 'FRBUK';
    const fromStopGroupGpuid = 'g|FRstraroet@u0tkr3';
    const intoStopGroupGpuid = 'g|FRstrasbou@u0tkru';

    groundPlacesService.moveSegmentProviderStop(segmentProviderStopId, fromStopGroupGpuid, intoStopGroupGpuid);

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
        childs: [],
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

  it('should throw an error if the current StopGroup parent and the new one are the same', () => {
    const groundPlacesService: GroundPlacesController = new GroundPlacesController();

    groundPlacesService.init(largeGroundPlacesFile as GroundPlacesFile);

    const segmentProviderStopId = 'FRBUK';
    const fromStopGroupGpuid = 'g|FRstraroet@u0tkr3';
    const intoStopGroupGpuid = 'g|FRstraroet@u0tkr3';

    let thrownError: Error;

    try {
      groundPlacesService.moveSegmentProviderStop(segmentProviderStopId, fromStopGroupGpuid, intoStopGroupGpuid);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new Error(
        'You can\'t move the SegmentProviderStop with the ID "FRBUK" because the new StopGroup parent is the same as before.',
      ),
    );
  });

  it('should throw an error if the current StopGroup parent is not found', () => {
    const groundPlacesService: GroundPlacesController = new GroundPlacesController();

    groundPlacesService.init(largeGroundPlacesFile as GroundPlacesFile);

    const segmentProviderStopId = 'FRBUK';
    const fromStopGroupGpuid = 'g|FRstraroet@u0tkr3333';
    const intoStopGroupGpuid = 'g|FRstraroet@u0tkr3';

    let thrownError: Error;

    try {
      groundPlacesService.moveSegmentProviderStop(segmentProviderStopId, fromStopGroupGpuid, intoStopGroupGpuid);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(new Error('The StopGroup with the Gpuid "g|FRstraroet@u0tkr3333" is not found.'));
  });

  it('should throw an error if the new StopGroup parent is not found', () => {
    const groundPlacesService: GroundPlacesController = new GroundPlacesController();

    groundPlacesService.init(largeGroundPlacesFile as GroundPlacesFile);

    const segmentProviderStopId = 'FRBUK';
    const fromStopGroupGpuid = 'g|FRstraroet@u0tkr3';
    const intoStopGroupGpuid = 'g|FRstraroet@u0tkr3333';

    let thrownError: Error;

    try {
      groundPlacesService.moveSegmentProviderStop(segmentProviderStopId, fromStopGroupGpuid, intoStopGroupGpuid);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(new Error('The StopGroup with the Gpuid "g|FRstraroet@u0tkr3333" is not found.'));
  });

  it("should throw an error if the SegmentProviderStop specified doesn't belong to the current StopCluster parent specified", () => {
    const groundPlacesService: GroundPlacesController = new GroundPlacesController();

    groundPlacesService.init(largeGroundPlacesFile as GroundPlacesFile);

    const segmentProviderStopId = 'FRBUK';
    const fromStopGroupGpuid = 'g|FRstrasbou@u0tkru';
    const intoStopGroupGpuid = 'g|FRstraroet@u0tkr3';

    let thrownError: Error;

    try {
      groundPlacesService.moveSegmentProviderStop(segmentProviderStopId, fromStopGroupGpuid, intoStopGroupGpuid);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new Error(
        'The SegmentProviderStop with the ID "FRBUK" doesn\'t exists inside the StopGroup with the Gpuid "g|FRstrasbou@u0tkru".',
      ),
    );
  });
});
