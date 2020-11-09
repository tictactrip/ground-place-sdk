import { GroundPlaces } from '../../src/classes/groundplaces';

describe('createStopCluster()', () => {
  it('should create two new actions for GroundPlacesDiff', () => {
    const GroundPlacesInstance: GroundPlaces = new GroundPlaces({});
    const addGroundPlacesDiffActions = jest.spyOn(GroundPlaces.prototype, 'addGroundPlacesDiffActions');

    const stopClusterInfos = {
      name: 'Paris, Île-de-France, France',
      latitude: 49.00443,
      longitude: 2.51703,
      countryCode: 'fr',
      currentStopGroupGpuid: 'g|FRnanceydhdjd4334',
      serviced: 'True',
      type: 'cluster',
    };

    GroundPlacesInstance.createStopCluster(stopClusterInfos);

    expect(addGroundPlacesDiffActions).toHaveBeenCalledTimes(1);
    expect(addGroundPlacesDiffActions).toHaveBeenCalledWith([
      {
        'c|FRparis___@u09yc': {
          childs: ['g|FRnanceydhdjd4334'],
          country_code: 'fr',
          latitude: 49.00443,
          longitude: 2.51703,
          name: 'Paris, Île-de-France, France',
          serviced: 'True',
          type: 'create',
        },
      },
      {
        'g|FRnanceydhdjd4334': {
          into: 'c|FRparis___@u09yc',
          type: 'add',
        },
      },
    ]);
  });
});
