import { GroundPlaces } from '../../src/classes/groundplaces';

describe('createStopCluster', () => {
  it('should create and add a new StopGroup to the GroundPlacesList with its Gpuid reference inside cluster parent childs', () => {
    const clusterGpuid = 'c|FRtroyes__@u0dfv';

    const GroundPlacesInstance: GroundPlaces = new GroundPlaces({
      [clusterGpuid]: {
        name: 'Troyes, Grand Est, France',
        latitude: 48.32633,
        longitude: 4.11027,
        country_code: 'fr',
        type: 'cluster',
        childs: [],
      },
    });

    const stopGroupInfos = {
      name: 'Paris, Île-de-France, France',
      latitude: 49.00443,
      longitude: 2.51703,
      countryCode: 'fr',
      type: 'group',
    };

    GroundPlacesInstance.createStopGroup(clusterGpuid, stopGroupInfos);

    expect(GroundPlacesInstance.Storage.getGroundPlacesList()).toEqual({
      [clusterGpuid]: {
        name: 'Troyes, Grand Est, France',
        latitude: 48.32633,
        longitude: 4.11027,
        country_code: 'fr',
        type: 'cluster',
        childs: ['g|FRpailfrfr@u09yc2'],
      },
      'g|FRpailfrfr@u09yc2': {
        childs: [],
        country_code: 'fr',
        latitude: 49.00443,
        longitude: 2.51703,
        name: 'Paris, Île-de-France, France',
        type: 'group',
      },
    });
  });
});
