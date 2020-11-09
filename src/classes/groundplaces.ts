import { Generator } from '@tictactrip/gp-uid';
import { Storage } from '../classes/storage';
import {
  AutoComplete,
  StopGroup,
  StopCluster,
  GroundPlaceGenerated,
  SegmentProviderStop,
  StopGroupInfos,
  StopClusterInfos,
  StopGroupGpuid,
  StopClusterGpuid,
  StopGroupProperties,
  StopClusterProperties,
  AutoCompleteFilters,
  GroundPlacesDiff,
  GroundPlacesDiffAction,
  GroundPlacesDiffActionType,
  GroundPlaceType,
  GroundPlacesFile,
} from '../types';

const { Create, Move, MoveSegmentProviderStop, Add } = GroundPlacesDiffActionType;

/**
 * @description GroundPlaces business logic.
 */
export class GroundPlaces {
  private readonly generatorService: Generator;

  public readonly storageService: Storage;

  public readonly groundPlacesDiff: GroundPlacesDiff;

  constructor(groundPlacesFile: GroundPlacesFile) {
    this.generatorService = new Generator();
    this.storageService = new Storage(groundPlacesFile);
    this.groundPlacesDiff = [];
  }

  /**
   * @description Returns a list of places.
   * @param {string} query - Can be a name, a Gpuid, a unique name or other name.
   * @param {AutoCompleteFilters} filters - Filters with different options (StopGroup, StopCluster, Serviced, SegmentProvider).
   * @returns {AutoComplete}
   */
  // @ts-ignore
  public autocomplete(query: string, filters: AutoCompleteFilters[]): AutoComplete {}

  /**
   * @description Create a new StopGroup from a SegmentProviderStop.
   * @param {SegmentProviderStop} segmentProviderStop - The SegmentProviderStop on which is based the StopGroup.
   * @param {StopGroupInfos} stopGroupInfos - StopGroup informations.
   * @param {StopClusterGpuid} stopClusterGpuid - Ground place unique identifier of the stopCluster parent.
   * @returns {StopGroup|Error}
   */
  public createStopGroup(
    segmentProviderStop: SegmentProviderStop,
    stopGroupInfos: StopGroupInfos,
    stopClusterGpuid: StopClusterGpuid,
    // @ts-ignore
  ): StopGroup | Error {
    const { id: stopGroupGpuid }: GroundPlaceGenerated = this.generatorService.gpuid(stopGroupInfos);
    const { latitude, longitude, name, countryCode, currentStopGroupGpuid, serviced } = stopGroupInfos;
    const { id: segmentProviderStopId } = segmentProviderStop;

    const createStopGroupAction = {
      [stopGroupGpuid]: {
        latitude,
        longitude,
        name,
        country_code: countryCode,
        childs: [segmentProviderStop],
        serviced,
        type: Create,
      },
    };

    const moveStopGroupToStopClusterAction = {
      [stopGroupGpuid]: {
        into: stopClusterGpuid,
        type: Move,
      },
    };

    const moveSegmentProviderStopAction = {
      [currentStopGroupGpuid]: {
        segmentProviderStopId,
        into: stopClusterGpuid,
        type: MoveSegmentProviderStop,
      },
    };

    this.addGroundPlacesDiffActions([
      createStopGroupAction,
      moveStopGroupToStopClusterAction,
      moveSegmentProviderStopAction,
    ]);

    // TODO: Call applyGroundPlacesDiff and getStopGroup
    // this.applyGroundPlacesDiff();
    // return this.storageService.getStopGroup(stopGroupGpuid);
  }

  /**
   * @description Create a new StopCluster from a StopGroup.
   * @param {StopClusterInfos} stopClusterInfos - StopCluster informations.
   * @returns {StopCluster|Error}
   */
  // @ts-ignore
  public createStopCluster(stopClusterInfos: StopClusterInfos): StopCluster | Error {
    const { id: stopClusterGpuid }: GroundPlaceGenerated = this.generatorService.gpuid(stopClusterInfos);
    const { latitude, longitude, name, countryCode, currentStopGroupGpuid, serviced } = stopClusterInfos;

    const createStopClusterAction = {
      [stopClusterGpuid]: {
        latitude,
        longitude,
        name,
        country_code: countryCode,
        childs: [currentStopGroupGpuid],
        serviced,
        type: Create,
      },
    };

    const addStopGroupToStopClusterAction = {
      [currentStopGroupGpuid]: {
        into: stopClusterGpuid,
        type: Add,
      },
    };

    this.addGroundPlacesDiffActions([createStopClusterAction, addStopGroupToStopClusterAction]);

    // TODO: Call applyGroundPlacesDiff and getStopCluster
    // this.applyGroundPlacesDiff();
    // return this.storageService.getStopCluster(stopClusterGpuid);
  }

  /**
   * @description Update the stopGroup with the new values given.
   * @param {StopGroupGpuid} stopGroupGpuid - Ground place unique identifier of a StopGroup.
   * @param {StopGroupProperties} propertiesToUpdate - Properties that need to be update.
   * @returns {StopGroup}
   */
  // @ts-ignore
  public updateStopGroup(stopGroupGpuid: StopGroupGpuid, propertiesToUpdate: StopGroupProperties): StopGroup {}

  /**
   * @description Update the stopCluster with the new values given.
   * @param {StopClusterGpuid} stopClusterGpuid - Ground place unique identifier.
   * @param {StopClusterProperties} propertiesToUpdate - Properties that need to be update.
   * @returns {StopCluster}
   */
  // @ts-ignore
  public updateStopCluster(
    stopClusterGpuid: StopClusterGpuid,
    propertiesToUpdate: StopClusterProperties,
    // @ts-ignore
  ): StopCluster {}

  /**
   * @description Remove a stopGroup from a stopCluster.
   * @param {StopClusterGpuid} stopClusterGpuid - Ground place unique identifier of a StopCluster.
   * @param {StopGroupGpuid} stopGroupGpuid - StopGroup Ground place unique identifier to remove.
   * @returns {void}
   */
  public removeStopGroupFromStopCluster(stopClusterGpuid: StopClusterGpuid, stopGroupGpuid: StopGroupGpuid): void {}

  /**
   * @description Move a segmentProviderStop from a stopGroup to another stopGroup.
   * Warning: The segmentProviderStop cannot be without a parent.
   * @param {string} segmentProviderId - The identifier of the segmentProvider to move.
   * @param {StopGroupGpuid} fromStopGroupGpuid - Ground place unique identifier of the old stopGroup.
   * @param {StopGroupGpuid} intoStopGroupGpuid - Ground place unique identifier of the new stopGroup.
   * @returns {void}
   */
  public moveSegmentProviderStop(
    segmentProviderId: string,
    fromStopGroupGpuid: StopGroupGpuid,
    intoStopGroupGpuid: StopGroupGpuid,
  ): void {}

  /**
   * @description Move a stopGroup from a stopCluster to another stopCluster.
   * @param {StopGroupGpuid} stopGroupToMoveGpuid - Ground place unique identifier of the stopGroup to move.
   * @param {StopClusterGpuid} fromStopClusterGpuid - Ground place unique identifier of the old stopCluster.
   * @param {StopClusterGpuid} intoStopClusterGpuid - Ground place unique identifier of the new stopCluster.
   * @returns {StopCluster}
   */
  public moveStopGroup(
    stopGroupToMoveGpuid: StopGroupGpuid,
    fromStopClusterGpuid: StopClusterGpuid,
    intoStopClusterGpuid: StopClusterGpuid,
    // @ts-ignore
  ): StopCluster {}

  /**
   * @description Delete place only if it's empty.
   * @param {GroundPlaceType} groundPlaceType - Ground place type 'cluster' or 'group'.
   * @param {StopGroupGpuid|StopClusterGpuid} placeToRemoveGpuid - Ground place unique identifier of the place to remove.
   * @returns {void}
   */
  public deletePlace(groundPlaceType: GroundPlaceType, placeToRemoveGpuid: StopGroupGpuid | StopClusterGpuid): void {}

  /**
   * @description Add a stopGroup to a stopCluster.
   * @param {StopGroupGpuid} stopGroupToAddGpuid - Ground place unique identifier of the stopGroup to add.
   * @param {StopClusterGpuid} intoStopClusterGpuid - Ground Place unique identifier of the stopCluster.
   * @returns {StopCluster}
   */
  public addStopGroupToStopCluster(
    stopGroupToAddGpuid: StopGroupGpuid,
    intoStopClusterGpuid: StopClusterGpuid,
    // @ts-ignore
  ): StopCluster {}

  /**
   * @description Merge two stopGroups. It means moving all segmentProviderStop of a stopGroup into another.
   * Warning: Check first if the merged stopGroup don't have two segmentStopProvider of the same segmentProvider in it.
   * @param {StopGroupGpuid} stopGroupToMergeGpuid - Ground place unique identifier of the stopGroup to merge.
   * @param {StopGroupGpuid} intoStopGroupGpuid - Ground Place unique identifier of the stopGroup to be merged.
   * @returns {StopGroup}
   */
  // @ts-ignore
  public mergeStopGroup(stopGroupToMergeGpuid: StopGroupGpuid, intoStopGroupGpuid: StopGroupGpuid): StopGroup {}

  /**
   * @description Merge two stopClusters. It Means moving all stopGroup of a stopCluster into another.
   * Warning: A stopGroup can belong to both stopCluster, in this case, just remove it from the first stopCluster.
   * @param {StopClusterGpuid} stopClusterToMergeGpuid - Ground place unique identifier of the stopCluster to merge.
   * @param {StopClusterGpuid} intoStopClusterGpuid - Ground place unique identifier of the stopCluster to be merged.
   * @returns {StopCluster}
   */
  public mergeStopCluster(
    stopClusterToMergeGpuid: StopClusterGpuid,
    intoStopClusterGpuid: StopClusterGpuid,
    // @ts-ignore
  ): StopCluster {}

  /**
   * @description Check if all the business rules are respected.
   * Returns true if everything ok, throw an error with all issues if not.
   * @returns {boolean|Error}
   */
  // @ts-ignore
  private checkValidity(): boolean | Error {}

  // @ts-ignore
  /**
   * @description This method is used to push new action(s) to do for the Storage class.
   * @param {GroundPlacesDiffAction[]} groundPlacesDiffActions - An action (move, add, update, merge, ...) to apply to ground places.
   * @returns {GroundPlacesDiff}
   */
  public addGroundPlacesDiffActions(groundPlacesDiffActions: GroundPlacesDiffAction[]): GroundPlacesDiff {
    this.groundPlacesDiff.push(...groundPlacesDiffActions);

    return this.groundPlacesDiff;
  }

  /**
   * @description Check the validity of the GroundPlacesDiff structure.
   * Returns true if everything ok, throw an error with all issues if not.
   * @returns {boolean|Error}
   */
  // @ts-ignore
  private checkGroundPlacesDiffValidity(): boolean | Error {}

  /**
   * @description Apply the diff file to the GroundPlacesDiff object.
   * @param {GroundPlacesDiff} groundPlacesDiff - Object that store the history of changes of the GroundPlaces.
   * @returns {GroundPlacesDiff|Error}
   */
  // @ts-ignore
  public applyGroundPlacesDiff(groundPlacesDiff?: GroundPlacesDiff): GroundPlacesDiff | Error {
    // const groundPlacesDiffSource = groundPlacesDiff || this.groundPlacesDiff;
    // process with groundPlacesDiffSource..
  }
}
