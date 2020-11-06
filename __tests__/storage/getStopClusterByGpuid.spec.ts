import { GroundPlaces } from '../../src/classes/groundplaces';

describe('getStopClusterByGpuid', () => {
  it('should retrieve the StopCluster based on its Gpuid', () => {
    const stopClusterGpuid = 'c|FRtroyes__@u0dfv';

    const GroundPlacesInstance: GroundPlaces = new GroundPlaces({
      [stopClusterGpuid]: {
        name: 'Troyes, Grand Est, France',
        latitude: 48.32633,
        longitude: 4.11027,
        country_code: 'fr',
        type: 'cluster',
        childs: [],
      },
    });

    const foundStopClusterByGpuid = GroundPlacesInstance.Storage.getStopClusterByGpuid(stopClusterGpuid);

    expect(foundStopClusterByGpuid).toEqual({
      name: 'Troyes, Grand Est, France',
      latitude: 48.32633,
      longitude: 4.11027,
      country_code: 'fr',
      type: 'cluster',
      childs: [],
    });
  });

  it('should thrown an error if the Gpuid is not found', () => {
    const stopClusterGpuid = 'c|FRtroyes__@u0dfv';

    const GroundPlacesInstance: GroundPlaces = new GroundPlaces({
      [stopClusterGpuid]: {
        name: 'Troyes, Grand Est, France',
        latitude: 48.32633,
        longitude: 4.11027,
        country_code: 'fr',
        type: 'cluster',
        childs: [],
      },
    });

    const GpuidToRetrieve = 'badGpuid';
    let thrownError;

    try {
      GroundPlacesInstance.Storage.getStopClusterByGpuid('badGpuid');
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError.message).toEqual(`The StopCluster with the Gpuid ${GpuidToRetrieve} is not found.`);
  });
});
