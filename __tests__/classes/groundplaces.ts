import { GroundPlaces } from '../../src/classes/groundplaces';

describe('GroundPlaces class implementation', () => {
  describe('createStopCluster', () => {
    it('should create and add a new StopCluster to the GroundPlacesList', () => {
      const GroundPlacesInstance: GroundPlaces = new GroundPlaces([]);

      const infos = {
        name: 'Paris, Île-de-France, France',
        latitude: 49.00443,
        longitude: 2.51703,
        countryCode: 'fr',
        type: 'cluster',
      };

      GroundPlacesInstance.createStopCluster(infos);

      expect(GroundPlacesInstance.Storage.getGroundPlacesList()).toEqual([
        {
          'c|FRparis___@u09yc': {
            country_code: 'fr',
            name: 'Paris, Île-de-France, France',
            longitude: 2.51703,
            latitude: 49.00443,
            type: 'cluster',
            childs: [],
          },
        },
      ]);
    });
  });
});
