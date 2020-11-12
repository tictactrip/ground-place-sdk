import { Storage } from '../../src/classes/storage';

const dummyGroundPlaces = JSON.stringify({
  'c|FRstrasbou@u0ts2': {
    unique_name: 'strasbourg',
    childs: ['g|FRststbi__@u0tkxd'],
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
  'g|FRststbi__@u0tkxd': {
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
    name: 'Strasbourg, Strasbourg - Bischheim',
    longitude: 7.719863,
    serviced: 'True',
    has_been_modified: false,
    warning: false,
    country_code: 'fr',
    latitude: 48.616228,
    is_latest: true,
    type: 'group',
  },
});

describe('readJSONFile()', () => {
  it('should parse a JSON file when the Storage is instanciate', () => {
    const StorageInstance: Storage = new Storage(dummyGroundPlaces);

    expect(StorageInstance.readJSONFile).toHaveBeenCalledTimes(1);
    expect(StorageInstance.getGroundPlaces()).toStrictEqual(JSON.parse(dummyGroundPlaces));
  });
});
