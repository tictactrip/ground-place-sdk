import { GroundPlaces } from '../../src/classes/groundplaces';
import { GroundPlacesDiffActionType } from '../../src/types';

const { Add, MoveSegmentProviderStop } = GroundPlacesDiffActionType;

describe('addGroundPlacesDiffActions()', () => {
  it('should add one action to groundPlacesDiff', () => {
    const GroundPlacesInstance: GroundPlaces = new GroundPlaces({});

    const addStopGroupToStopClusterAction = {
      ['currentStopGroupGpuid']: {
        into: 'stopClusterGpuid',
        type: Add,
      },
    };

    GroundPlacesInstance.addGroundPlacesDiffActions([addStopGroupToStopClusterAction]);

    expect(GroundPlacesInstance.groundPlacesDiff).toStrictEqual([addStopGroupToStopClusterAction]);
  });

  it('should add multiple actions to groundPlacesDiff', () => {
    const GroundPlacesInstance: GroundPlaces = new GroundPlaces({});

    const addStopGroupToStopClusterAction = {
      ['currentStopGroupGpuid']: {
        into: 'stopClusterGpuid',
        type: Add,
      },
    };

    const moveSegmentProviderStopAction = {
      ['currentStopGroupGpuid']: {
        segmentProviderStopId: 'segmentProviderStopId',
        into: 'stopClusterGpuid',
        type: MoveSegmentProviderStop,
      },
    };

    GroundPlacesInstance.addGroundPlacesDiffActions([addStopGroupToStopClusterAction, moveSegmentProviderStopAction]);

    expect(GroundPlacesInstance.groundPlacesDiff).toStrictEqual([
      addStopGroupToStopClusterAction,
      moveSegmentProviderStopAction,
    ]);
  });
});
