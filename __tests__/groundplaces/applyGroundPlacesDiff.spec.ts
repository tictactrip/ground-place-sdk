import { GroundPlacesController } from '../../src/classes/groundplaces';
import * as mockSmallGroundPlacesFile from '../../mocks/smallGroundPlacesFile.json';
import * as mockGroundPlacesDiffFileCorrect from '../../mocks/groundPlacesDiffFileCorrect.json';
import * as mockGroundPlacesDiffFileWithErrors from '../../mocks/groundPlacesDiffFileWithErrors.json';
import * as mockGroundPlacesDiffFileWithMissingValues from '../../mocks/groundPlacesDiffFileWithMissingValues.json';
import * as mockGroundPlacesDiffFileWithNothing from '../../mocks/groundPlacesDiffFileWithNothing.json';
import { GroundPlacesFile, GroundPlaceDiff } from '../../src/types';

describe('#applyGroundPlacesDiff', () => {
  it('should make all Ground Places diff changes', () => {
    const groundPlacesService: GroundPlacesController = new GroundPlacesController();

    groundPlacesService.init(mockSmallGroundPlacesFile as GroundPlacesFile);
    groundPlacesService.applyGroundPlacesDiff(mockGroundPlacesDiffFileCorrect as GroundPlaceDiff[]);

    expect(groundPlacesService.getGroundPlaces()).toStrictEqual([
      {
        gpuid: 'c|FRstrasbou@u0ts2',
        unique_name: 'strasbourg',
        childs: ['g|FRstraroet@u0twc2'],
        serviced: 'True',
        has_been_modified: false,
        warning: false,
        country_code: 'fr',
        is_latest: true,
        name: 'Strasbourg, Grand-Est, France',
        longitude: 7.74815,
        latitude: 48.45,
        type: 'cluster',
      },
      {
        gpuid: 'g|FRstraroet@u0twc2',
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
        latitude: 49,
        longitude: 7.8,
        name: 'Strasbourg, Grand-Nord',
        serviced: 'False',
        type: 'group',
        country_code: 'fr',
      },
    ]);
  });

  it('should throw an error if there is no GroundPlaces', () => {
    const groundPlacesService: GroundPlacesController = new GroundPlacesController();

    let thrownError: Error;

    try {
      groundPlacesService.applyGroundPlacesDiff(mockGroundPlacesDiffFileCorrect as GroundPlaceDiff[]);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new Error(
        'You can\'t apply your GroundPlacesDiffFile because there is no GroundPlaces available on this instance. You should call the "init" method with your GroundPlacesFile before using this method.',
      ),
    );
  });

  it('should throw an error if there is errors inside the GroundPlacesDiffFile', () => {
    const groundPlacesService: GroundPlacesController = new GroundPlacesController();

    let thrownError: Error;

    try {
      groundPlacesService.init(mockSmallGroundPlacesFile as GroundPlacesFile);
      groundPlacesService.applyGroundPlacesDiff(mockGroundPlacesDiffFileWithErrors as GroundPlaceDiff[]);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new Error(
        'There is an error inside your GroundPlacesDiffFile. More details: "You can\'t move the StopGroup with the Gpuid "g|FRststbi__@u0tkxd" because the new StopCluster parent is the same as before."',
      ),
    );
  });

  it('should throw an error if there is missing values inside the GroundPlacesDiffFile', () => {
    const groundPlacesService: GroundPlacesController = new GroundPlacesController();

    let thrownError: Error;

    try {
      groundPlacesService.init(mockSmallGroundPlacesFile as GroundPlacesFile);
      groundPlacesService.applyGroundPlacesDiff(mockGroundPlacesDiffFileWithMissingValues as GroundPlaceDiff[]);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new Error(
        'There is an error inside your GroundPlacesDiffFile. More details: "Error while creating a new StopCluster, please check that you have provide all properties needed (fromStopGroupGpuid, countryCode, latitude, longitude and name)."',
      ),
    );
  });

  it('should throw an error if the GroundPlaces did not have any update', () => {
    const groundPlacesService: GroundPlacesController = new GroundPlacesController();

    let thrownError: Error;

    try {
      groundPlacesService.init(mockSmallGroundPlacesFile as GroundPlacesFile);
      groundPlacesService.applyGroundPlacesDiff(mockGroundPlacesDiffFileWithNothing as GroundPlaceDiff[]);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new Error(
        'GroundPlaces update did not work. Please check the structure and integrity of the GroundPlacesDiff file used before apply it.',
      ),
    );
  });
});
