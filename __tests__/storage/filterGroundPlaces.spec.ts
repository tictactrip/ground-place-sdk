import { Storage } from '../../src/classes/storage';
import * as mock from '../../mocks/mockGroundPlaces.json';
import { AutoComplete, GroundPlaces } from '../../src/types';

describe('#filterGroundPlaces', () => {
  const storageInstance: Storage = new Storage();
  storageInstance.initFile(mock as GroundPlaces);

  it('should return an array of current ground places no filtered if no filters are provided', () => {
    const autocompleteGroundPlaces: AutoComplete[] = storageInstance.filterGroundPlaces();

    expect(autocompleteGroundPlaces).toStrictEqual([
      {
        childs: ['g|FRststbi__@u0tkxd'],
        country_code: 'fr',
        gpuid: 'c|FRstrasbou@u0ts2',
        has_been_modified: false,
        is_latest: true,
        latitude: 48.583,
        longitude: 7.74815,
        name: 'Strasbourg, Grand-Est, France',
        serviced: 'True',
        type: 'cluster',
        unique_name: 'strasbourg',
        warning: false,
      },
      {
        childs: [
          {
            company_id: 5,
            company_name: 'flixbus',
            id: '19528',
            latitude: 48.616228,
            longitude: 7.719863,
            name: 'Strasbourg, Strasbourg - Bischheim',
            serviced: 'True',
            unique_name: null,
          },
        ],
        country_code: 'fr',
        gpuid: 'g|FRststbi__@u0tkxd',
        has_been_modified: false,
        is_latest: true,
        latitude: 48.616228,
        longitude: 7.719863,
        name: 'Strasbourg, Strasbourg - Bischheim',
        serviced: 'True',
        type: 'group',
        warning: false,
      },
    ]);
  });
});
