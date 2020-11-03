import {
  AutoComplete,
  StopGroup,
  StopCluster,
  StopGroupGpuid,
  StopClusterGpuid,
  StopGroupProperties,
  StopClusterProperties,
  Filters,
  GroundPlacesDiff,
  GroundPlaceType,
} from '../types';

/**
 * @description GroundPlaces business logic.
 */
export class GroundPlaces {
  /**
   * @description Returns a list of places.
   * @param {string} query - Can be a name, a Gpuid, a unique name or other name.
   * @param {Filters} filters - Filters with different options (StopGroup, StopCluster, Serviced, SegmentProvider).
   * @returns {AutoComplete}
   */
  // @ts-ignore
  public autocomplete(query: string, filters: Filters): AutoComplete {}

  /**
   * @description Create the stopGroup with the values given.
   * @param {StopClusterGpuid} stopClusterGpuid - Ground place unique identifier of the stopCluster parent.
   * @param {StopGroup} stopGroupInfos - StopGroup informations.
   * @returns {StopGroup}
   */
  // @ts-ignore
  public createStopGroup(stopClusterGpuid: StopClusterGpuid, stopGroupInfos: StopGroup): StopGroup {}

  /**
   * @description Create the stopCluster with the values given.
   * @param {StopCluster} stopClusterInfos - StopCluster informations.
   * @returns {StopCluster}
   */
  // @ts-ignore
  public createStopCluster(stopClusterInfos: StopCluster): StopCluster {}

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
  // @ts-ignore
  public moveStopGroup(
    stopGroupToMoveGpuid: StopGroupGpuid,
    fromStopClusterGpuid: StopClusterGpuid,
    intoStopClusterGpuid: StopClusterGpuid,
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
  // @ts-ignore
  public addStopGroupToStopCluster(
    stopGroupToAddGpuid: StopGroupGpuid,
    intoStopClusterGpuid: StopClusterGpuid,
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
  // @ts-ignore
  public mergeStopCluster(
    stopClusterToMergeGpuid: StopClusterGpuid,
    intoStopClusterGpuid: StopClusterGpuid,
  ): StopCluster {}

  /**
   * @description Check if all the business rules are respected.
   * Returns true if everything ok, throw an error with all issues if not.
   * @returns {boolean|Error}
   */
  // @ts-ignore
  private checkValidity(): boolean | Error {}

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
   * @returns {GroundPlacesDiff}
   */
  // @ts-ignore
  private applyGroundPlacesDiff(groundPlacesDiff: GroundPlacesDiff): GroundPlacesDiff {}
}
