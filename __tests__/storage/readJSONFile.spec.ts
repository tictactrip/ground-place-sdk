import { GroundPlaces } from '../../src/classes/groundplaces';
import { Storage } from '../../src/classes/storage';

describe('readJSONFile()', () => {
  it('should read a JSON file passed', () => {
    const readJSONFile = jest.spyOn(Storage.prototype, 'readJSONFile');

    const GroundPlacesInstance = new GroundPlaces({
      'c|FRstrasbou@u0ts2': {
        unique_name: 'strasbourg',
        childs: ['g|FRststbi__@u0tkxd', 'g|FRstrasbou@u0tkru', 'g|FRstraroet@u0tkr3'],
        serviced: 'True',
        has_been_modified: false,
        warning: false,
        country_code: 'fr',
        is_latest: true,
        name: 'Strasbourg, Grand-Est, France',
        longitude: 7.74815,
        latitude: 48.583,
        type: 'cluster',
      },
    });

    expect(readJSONFile).toHaveBeenCalledTimes(1);
    expect(GroundPlacesInstance.storageService.groundPlacesArray).toStrictEqual([
      {
        gpuid: 'c|FRstrasbou@u0ts2',
        place: {
          unique_name: 'strasbourg',
          childs: ['g|FRststbi__@u0tkxd', 'g|FRstrasbou@u0tkru', 'g|FRstraroet@u0tkr3'],
          serviced: 'True',
          has_been_modified: false,
          warning: false,
          country_code: 'fr',
          is_latest: true,
          name: 'Strasbourg, Grand-Est, France',
          longitude: 7.74815,
          latitude: 48.583,
          type: 'cluster',
        },
      },
    ]);
  });
});
