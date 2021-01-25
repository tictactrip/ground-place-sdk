import { GroundPlacesController } from '../../src/classes/groundplaces';
import * as mockSmallGroundPlacesFile from '../../mocks/smallGroundPlacesFile.json';
import * as mockGroundPlacesActionHistoryCorrect from '../../mocks/groundPlacesActionHistoryCorrect.json';
import * as mockGroundPlacesActionHistoryWithErrors from '../../mocks/groundPlacesActionHistoryWithErrors.json';
import * as mockGroundPlacesActionHistoryWithMissingValues from '../../mocks/groundPlacesActionHistoryWithMissingValues.json';
import { GroundPlacesFile, GroundPlaceActionHistory } from '../../src/types';

describe('#applyGroundPlacesActionHistory', () => {
  it('should make all GroundPlacesActionHistory changes', () => {
    const groundPlacesService: GroundPlacesController = new GroundPlacesController();

    groundPlacesService.init(mockSmallGroundPlacesFile as GroundPlacesFile);
    groundPlacesService.applyGroundPlacesActionHistory(
      mockGroundPlacesActionHistoryCorrect as GroundPlaceActionHistory[],
    );

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
      groundPlacesService.applyGroundPlacesActionHistory(
        mockGroundPlacesActionHistoryWithErrors as GroundPlaceActionHistory[],
      );
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new Error(
        'You can\'t apply your GroundPlacesActionHistory file because there is no GroundPlaces available on this instance. You should call the "init" method with your GroundPlacesFile before using this method.',
      ),
    );
  });

  it('should throw an error if there is errors inside the GroundPlacesDiffFile', () => {
    const groundPlacesService: GroundPlacesController = new GroundPlacesController();

    let thrownError: Error;

    try {
      groundPlacesService.init(mockSmallGroundPlacesFile as GroundPlacesFile);
      groundPlacesService.applyGroundPlacesActionHistory(
        mockGroundPlacesActionHistoryWithErrors as GroundPlaceActionHistory[],
      );
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new Error(
        'There is an error inside your GroundPlacesActionHistory file. More details: "You can\'t move the StopGroup with the Gpuid "g|FRststbi__@u0tkxd" because the new StopCluster parent is the same as before."',
      ),
    );
  });

  it('should throw an error if there is missing values inside the GroundPlacesDiffFile', () => {
    const groundPlacesService: GroundPlacesController = new GroundPlacesController();

    let thrownError: Error;

    try {
      groundPlacesService.init(mockSmallGroundPlacesFile as GroundPlacesFile);
      groundPlacesService.applyGroundPlacesActionHistory(
        mockGroundPlacesActionHistoryWithMissingValues as GroundPlaceActionHistory[],
      );
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new Error(
        'There is an error inside your GroundPlacesActionHistory file. More details: "Error while creating a new StopCluster, please check that you have provide all properties needed (fromStopGroupGpuid, countryCode, latitude, longitude and name)."',
      ),
    );
  });
});
