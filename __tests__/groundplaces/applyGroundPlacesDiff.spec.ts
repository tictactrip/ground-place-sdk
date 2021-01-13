import { GroundPlacesController } from '../../src/classes/groundplaces';
import * as mockSmallGroundPlacesFile from '../../mocks/smallGroundPlacesFile.json';
import * as mockGroundPlacesDiffFileCorrect from '../../mocks/groundPlacesDiffFileCorrect.json';
import { GroundPlacesFile, GroundPlacesDiffFile } from '../../src/types';

describe('#applyGroundPlacesDiff', () => {
  const groundPlacesService: GroundPlacesController = new GroundPlacesController();

  it('should make all Ground Places diff changes', () => {
    groundPlacesService.init(mockSmallGroundPlacesFile as GroundPlacesFile);
    groundPlacesService.applyGroundPlacesDiff(mockGroundPlacesDiffFileCorrect as GroundPlacesDiffFile);

    expect(groundPlacesService.getGroundPlaces()).toEqual([
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
});
