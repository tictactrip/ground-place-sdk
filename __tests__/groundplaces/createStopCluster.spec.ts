import { GroundPlaces } from '../../src/classes/groundplaces';

describe('createStopCluster', () => {
  xit('should create and add a new StopCluster to the GroundPlacesList', () => {
    const GroundPlacesInstance: GroundPlaces = new GroundPlaces({});

    const infos = {
      name: 'Paris, Île-de-France, France',
      latitude: 49.00443,
      longitude: 2.51703,
      countryCode: 'fr',
      type: 'cluster',
    };

    GroundPlacesInstance.createStopCluster(infos);

    expect(GroundPlacesInstance.storageService.getGroundPlacesList()).toEqual({
      'c|FRparis___@u09yc': {
        country_code: 'fr',
        name: 'Paris, Île-de-France, France',
        longitude: 2.51703,
        latitude: 49.00443,
        type: 'cluster',
        childs: [],
      },
    });
  });
});
