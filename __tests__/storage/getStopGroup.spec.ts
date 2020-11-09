import { GroundPlaces } from '../../src/classes/groundplaces';
import { Storage } from '../../src/classes/storage';

const dummyPlace = {
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
  'g|FRstraroet@u0tkr3': {
    childs: [
      {
        unique_name: null,
        company_name: 'vsc',
        name: 'Strasbourg Roethig',
        latitude: 48.569,
        serviced: 'True',
        company_id: 10,
        longitude: 7.704,
        id: 'FRBUK',
      },
    ],
    name: 'Strasbourg Roethig',
    longitude: 7.704,
    serviced: 'True',
    has_been_modified: false,
    warning: false,
    country_code: 'fr',
    latitude: 48.569,
    is_latest: true,
    type: 'group',
  },
};

describe('getStopGroup()', () => {
  it('should return the right StopGroup based on its Gpuid', () => {
    const getStopGroup = jest.spyOn(Storage.prototype, 'getStopGroup');

    const GroundPlacesInstance: GroundPlaces = new GroundPlaces(dummyPlace);

    const stopGroup = GroundPlacesInstance.storageService.getStopGroup('g|FRstraroet@u0tkr3');

    expect(getStopGroup).toHaveBeenCalledTimes(1);
    expect(stopGroup).toEqual(dummyPlace['g|FRstraroet@u0tkr3']);
  });

  it('should throw an error if the StopGroup based on its Gpuid is not found', () => {
    const GroundPlacesInstance: GroundPlaces = new GroundPlaces(dummyPlace);

    let thrownError;

    try {
      GroundPlacesInstance.storageService.getStopGroup('badGpuid');
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(new Error('The StopGroup with the Gpuid badGpuid is not found.'));
  });

  it('should throw an error if the StopGroup based on its Gpuid is found but not of type group', () => {
    const GroundPlacesInstance: GroundPlaces = new GroundPlaces(dummyPlace);

    let thrownError;

    try {
      GroundPlacesInstance.storageService.getStopGroup('c|FRstrasbou@u0ts2');
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(new Error('The StopGroup with the Gpuid c|FRstrasbou@u0ts2 is not found.'));
  });
});
