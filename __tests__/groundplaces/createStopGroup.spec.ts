import { GroundPlaces } from '../../src/classes/groundplaces';

describe('createStopGroup()', () => {
  it('should create three new actions for GroundPlacesDiff', () => {
    const GroundPlacesInstance: GroundPlaces = new GroundPlaces({});
    const addGroundPlacesDiffActions = jest.spyOn(GroundPlaces.prototype, 'addGroundPlacesDiffActions');

    const stopClusterGpuid = 'c|FRtroyes__@u0dfv';

    const segmentProviderStop = {
      id: '455',
      unique_name: null,
      company_name: 'vsc',
      name: 'Paris, Île-de-France, France',
      latitude: 49.00443,
      longitude: 2.51703,
      serviced: 'True',
      company_id: 10,
    };

    const stopGroupInfos = {
      name: 'Paris, Île-de-France, France',
      latitude: 49.00443,
      longitude: 2.51703,
      countryCode: 'fr',
      currentStopGroupGpuid: 'c|FRnancded@u0dfv',
      serviced: 'True',
      type: 'group',
    };

    GroundPlacesInstance.createStopGroup(segmentProviderStop, stopGroupInfos, stopClusterGpuid);

    expect(addGroundPlacesDiffActions).toHaveBeenCalledTimes(1);
    expect(addGroundPlacesDiffActions).toHaveBeenCalledWith([
      {
        'g|FRpailfrfr@u09yc2': {
          childs: [
            {
              company_id: 10,
              company_name: 'vsc',
              id: '455',
              latitude: 49.00443,
              longitude: 2.51703,
              name: 'Paris, Île-de-France, France',
              serviced: 'True',
              unique_name: null,
            },
          ],
          country_code: 'fr',
          latitude: 49.00443,
          longitude: 2.51703,
          name: 'Paris, Île-de-France, France',
          serviced: 'True',
          type: 'create',
        },
      },
      { 'g|FRpailfrfr@u09yc2': { into: 'c|FRtroyes__@u0dfv', type: 'move' } },
      {
        'c|FRnancded@u0dfv': {
          into: 'c|FRtroyes__@u0dfv',
          segmentProviderStopId: '455',
          type: 'moveSegmentProviderStop',
        },
      },
    ]);
  });
});
