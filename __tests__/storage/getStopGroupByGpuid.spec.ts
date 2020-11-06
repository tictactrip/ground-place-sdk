import { GroundPlaces } from '../../src/classes/groundplaces';

describe('getStopClusterByGpuid', () => {
  it('should retrieve the StopGroup based on its Gpuid', () => {
    const stopGroupGpuid = 'g|FRpailfrfr@u09yc2';

    const GroundPlacesInstance: GroundPlaces = new GroundPlaces({
      [stopGroupGpuid]: {
        childs: [],
        country_code: 'fr',
        latitude: 49.00443,
        longitude: 2.51703,
        name: 'Paris, Île-de-France, France',
        type: 'group',
      },
    });

    const foundStopGroupByGpuid = GroundPlacesInstance.Storage.getStopGroupByGpuid(stopGroupGpuid);

    expect(foundStopGroupByGpuid).toEqual({
      childs: [],
      country_code: 'fr',
      latitude: 49.00443,
      longitude: 2.51703,
      name: 'Paris, Île-de-France, France',
      type: 'group',
    });
  });

  it('should thrown an error if the Gpuid is not found', () => {
    const stopGroupGpuid = 'g|FRpailfrfr@u09yc2';

    const GroundPlacesInstance: GroundPlaces = new GroundPlaces({
      [stopGroupGpuid]: {
        childs: [],
        country_code: 'fr',
        latitude: 49.00443,
        longitude: 2.51703,
        name: 'Paris, Île-de-France, France',
        type: 'group',
      },
    });

    const GpuidToRetrieve = 'badGpuid';
    let thrownError;

    try {
      GroundPlacesInstance.Storage.getStopGroupByGpuid('badGpuid');
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError.message).toEqual(`The StopGroup with the Gpuid ${GpuidToRetrieve} is not found.`);
  });
});
