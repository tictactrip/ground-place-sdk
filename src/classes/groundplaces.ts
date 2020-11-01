
import { GroundPlace, StopGroup, StopCluster, Properties } from '../types';

interface Filters {}

interface GroundPlacesDiff {}

/**
 * @description GroundPlaces business logic.
 */
export class GroundPlaces {

  /**
   * @description Returns a list of places.
   * @param query Can be a name, a Gpuid, a unique name or other name.
   * @param filters Filters with different options (StopGroup, StopCluster, Serviced, SegmentProvider).
   * @returns {Array<StopGroup|StopCluster>}
   */
  // @ts-ignore
  public autocomplete(query: string, filters: Filters): (StopGroup | StopCluster)[] {}

  /**
   * @description Create stopCluster or stopGroup.
   * @param type Type can be stopCluster or stopGroup.
   * @param groundPlace Informations to use for creating the place.
   * @param GpuidParent Ground place unique identifier of the stopCluster parent if the type is a stopGroup. 
   * @returns {StopGroup|StopCluster}
   */
  // @ts-ignore
  // This method will call Storage.createStopGroup or Storage.createStopCluster depending on type passed in params.
  public create(type: 'stopCluster' | 'stopGroup', groundPlace: GroundPlace, GpuidParent?: string): StopGroup | StopCluster {}

  /**
   * @description Create stopCluster or stopGroup.
   * @param type Type can be stopCluster or stopGroup.
   * @param Gpuid Ground place unique identifier.
   * @param propertiesToUpdate Properties that need to be update. 
   * @returns {StopGroup|StopCluster}
   */
  // @ts-ignore
  // This method will call Store.updateStopGroup or Storage.updateStopCluster depending on type passed in params.
  public update(type: 'stopCluster' | 'stopGroup', Gpuid: string, propertiesToUpdate: Properties): StopGroup | StopCluster {}

  /**
   * @description Remove a stopGroup from a stopCluster.
   * @param stopClusterGpuid StopCluster Ground place unique identifier.
   * @param stopGroupGpuid StopGroup Ground place unique identifier to remove.
   * @returns {Void}
   */
  public removeStopGroupFromStopCluster(stopClusterGpuid: string, stopGroupGpuid: string): void {}

  /**
   * @description Move a segmentProviderStop from a stopGroup to another stopGroup.
   * @param segmentProviderId The identifier of the segmentProvider to move.
   * @param fromStopGroupGpuid Ground place unique identifier of the old stopGroup.
   * @param intoStopGroupGpuid Ground place unique identifier of the new stopGroup.
   * @returns {Void}
   */
  // WARNING: The segmentProviderStop cannot be without a parent.
  public moveSegmentProviderStop(segmentProviderId: string, fromStopGroup: string, intoStopGroup: string): void {}

  /**
   * @description Move a stopGroup from a stopCluster to another stopCluster.
   * @param stopGroupToMoveGpuid Ground place unique identifier of the stopGroup to move.
   * @param fromStopClusterGpuid Ground place unique identifier of the old stopCluster.
   * @param intoStopClusterGpuid Greound place unique identifier of the new stopCluster.
   * @returns {StopCluster}
   */
  // @ts-ignore
  public moveStopGroup(stopGroupToMoveGpuid: string, fromStopClusterGpuid: string, intoStopClusterGpuid: string): StopCluster {}

  /**
   * @description Delete place only if it's empty.
   * @param placeToRemoveGpuid Ground place unique identifier of the place to remove.
   * @returns {Void}
   */
  public deletePlace(placeToRemoveGpuid: string): void {}

  /**
   * @description Add a stopGroup to a stopCluster.
   * @param stopGroupToAddGpuid Ground place unique identifier of the stopGroup to add.
   * @param intoStopClusterGpuid Ground Place unique identifier of the stopCluster.
   * @returns {StopCluster}
   */
  // @ts-ignore
  public addStopGroupToStopCluster(stopGroupToAddGpuid: string, intoStopClusterGpuid: string): StopCluster {}

  /**
   * @description Merge two stopGroups. It means moving all segmentProviderStop of a stopGroup into another.
   * @param stopGroupToMergeGpuid Ground place unique identifier of the stopGroup to merge.
   * @param intoStopGroupGpuid Ground Place unique identifier of the stopGroup to be merged.
   * @returns {StopGroup}
   */
  // @ts-ignore
  // WARNING: Check first if the merged stopGroup don't have two segmentStopProvider of the same segmentProvider in it.
  public mergeStopGroup(stopGroupToMergeGpuid: string, intoStopGroupGpuid: string): StopGroup {} 

  /**
   * @description Merge two stopClusters. It Means moving all stopGroup of a stopCluster into another.
   * @param stopClusterToMergeGpuid Ground place unique identifier of the stopCluster to merge.
   * @param intoStopClusterGpuid Ground place unique identifier of the stopCluster to be merged.
   * @returns {StopCluster}
   */
  // @ts-ignore
  // WARNING: A stopGroup can belong to both stopCluster, in this case, just remove it from the first stopCluster.
  public mergeStopCluster(stopClusterToMergeGpuid: string, intoStopClusterGpuid: string): StopCluster {}

  /**
   * @description Check if all the business rules are respected. 
   * Returns true if everything ok, throw an error with all issues if not.
   * @returns {Boolean|Error}
   */
  // @ts-ignore
  private isValid(): boolean | Error {}

  /**
   * @description Check the validity of the GroundPlacesDiff structure.
   * Returns true if everything ok, throw an error with all issues if not.
   * @returns {Boolean|Error}
   */
  // @ts-ignore
  private isGroundPlacesDiffValid(): boolean | Error {}

  /**
   * @description Apply the diff file to the GroundPlacesDiff object.
   * @param groundPlacesDiff Object that store the history of changes of the GroundPlaces.
   * @returns {GroundPlacesDiff}
   */
  // @ts-ignore
  private applyGroundPlacesDiff(groundPlacesDiff: GroundPlacesDiff): GroundPlacesDiff {}
}