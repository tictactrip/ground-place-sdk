import { Storage } from '../../src/classes/storage';
import { fakeGroundPlacesJSON } from '../../mocks/groundPlaces';

describe('#getStopGroup', () => {
  const StorageInstance: Storage = new Storage();
  StorageInstance.initFile(fakeGroundPlacesJSON);

  it('should return the right StopGroup based on its Gpuid', () => {
    expect(StorageInstance.getStopGroupByGpuid('g|FRststbi__@u0tkxd')).toStrictEqual({
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
    });
  });

  it('should throw an error if the StopGroup based on its Gpuid is not found', () => {
    let thrownError;

    try {
      StorageInstance.getStopGroupByGpuid('g|FRststbi__@');
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(new Error('The StopGroup with the Gpuid g|FRststbi__@ is not found.'));
  });

  it('should throw an error if the StopGroup based on its Gpuid is found but not of type group', () => {
    let thrownError;

    try {
      StorageInstance.getStopGroupByGpuid('c|FRstrasbou@u0ts2');
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(new Error('The StopGroup with the Gpuid c|FRstrasbou@u0ts2 is not found.'));
  });
});
