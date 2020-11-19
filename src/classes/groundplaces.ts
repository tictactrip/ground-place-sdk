import { Storage } from '../classes/storage';
import { WebServices } from './webservices';
import {
  AutoComplete,
  StopGroupGpuid,
  StopClusterGpuid,
  CreateStopGroupProperties,
  CreateStopClusterProperties,
  UpdateStopProperties,
  AutoCompleteFilters,
  GroundPlacesDiff,
  GroundPlaceType,
  GroundPlaces,
} from '../types';

/**
 * @description GroundPlaces business logic.
 */
export class GroundPlacesController {
  private readonly storageService: Storage;

  private readonly webService: WebServices;

  /**
   * @description Manipulate GroundPlaces file.
   * @param {string} groundPlacesFile - The file to manipulate, can only be JSON for now.
   */
  constructor() {
    this.storageService = new Storage();

    this.webService = new WebServices();
  }

  /**
   * @description Init GroundPlaces file.
   * @param {string|undefined} groundPlacesFile - The file to manipulate, can only be JSON for now.
   * If you provide empty value, the default file will be the file retrieved from Amazon S3.
   */
  public init(groundPlacesFile?: GroundPlaces): void {
    if (groundPlacesFile) {
      this.storageService.initFile(groundPlacesFile);
    } else {
      const groundPlacesFileS3: GroundPlaces = this.webService.downloadDistantGroundPlacesMaster();

      this.storageService.initFile(groundPlacesFileS3);
    }
  }

  /**
   * @description Returns a list of places.
   * @param {string} query - Can be a name, a Gpuid, a unique name or other name.
   * @param {AutoCompleteFilters} filters - Filters with different options (StopGroup, StopCluster, Serviced, SegmentProvider).
   * @returns {AutoComplete[]}
   */
  // @ts-ignore
  public autocomplete(query: string, filters: AutoCompleteFilters[]): AutoComplete[] {}

  /**
   * @description Create a new StopGroup from a SegmentProviderStop.
   * @param {CreateStopGroupProperties} createStopGroupProperties - Properties that are needed to create a new StopGroup.
   * @param {StopClusterGpuid} stopClusterParentGpuid - Ground place unique identifier of the StopCluster parent.
   * @returns {void}
   */
  public createStopGroup(
    createStopGroupProperties: CreateStopGroupProperties,
    stopClusterParentGpuid: StopClusterGpuid,
  ): void {}

  /**
   * @description Create a new StopCluster from a StopGroup.
   * @param {CreateStopClusterProperties} createStopClusterProperties - Properties that are needed to create a new StopCluster.
   * @param {StopGroupGpuid} fromStopGroupGpuid - Ground place unique identifier of the StopGroup on which the StopCluster will be created.
   * @returns {void}
   */
  public createStopCluster(
    createStopClusterProperties: CreateStopClusterProperties,
    fromStopGroupGpuid: StopGroupGpuid,
  ): void {}

  /**
   * @description Update the stopGroup with the new values given.
   * @param {StopGroupGpuid} stopGroupGpuid - Ground place unique identifier of a StopGroup.
   * @param {UpdateStopProperties} propertiesToUpdate - Properties that need to be update.
   * @returns {void}
   */
  public updateStopGroup(stopGroupGpuid: StopGroupGpuid, propertiesToUpdate: UpdateStopProperties): void {
    const copyGroundPlaces: GroundPlaces = this.storageService.getGroundPlaces();

    this.storageService.updatePlace(stopGroupGpuid, propertiesToUpdate);

    const isUpdateValid: boolean = this.checkValidity();

    // If the file is not valid after update, rollback to the previous version of the ground places stored
    if (!isUpdateValid) {
      this.storageService.setGroundPlaces(copyGroundPlaces);
    }
  }

  /**
   * @description Update the stopCluster with the new values given.
   * @param {StopClusterGpuid} stopClusterGpuid - Ground place unique identifier.
   * @param {UpdateStopProperties} propertiesToUpdate - Properties that need to be update.
   * @returns {void}
   */
  public updateStopCluster(stopClusterGpuid: StopClusterGpuid, propertiesToUpdate: UpdateStopProperties): void {
    const copyGroundPlaces: GroundPlaces = this.storageService.getGroundPlaces();

    this.storageService.updatePlace(stopClusterGpuid, propertiesToUpdate);

    const isUpdateValid: boolean = this.checkValidity();

    // If the file is not valid after update, rollback to the previous version of the ground places stored
    if (!isUpdateValid) {
      this.storageService.setGroundPlaces(copyGroundPlaces);
    }
  }

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
  ): void {}

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
   * @returns {void}
   */
  public addStopGroupToStopCluster(stopGroupToAddGpuid: StopGroupGpuid, intoStopClusterGpuid: StopClusterGpuid): void {}

  /**
   * @description Merge two stopGroups. It means moving all segmentProviderStop of a stopGroup into another.
   * Warning: Check first if the merged stopGroup don't have two segmentStopProvider of the same segmentProvider in it.
   * @param {StopGroupGpuid} stopGroupToMergeGpuid - Ground place unique identifier of the stopGroup to merge.
   * @param {StopGroupGpuid} intoStopGroupGpuid - Ground Place unique identifier of the stopGroup to be merged.
   * @returns {void}
   */
  public mergeStopGroup(stopGroupToMergeGpuid: StopGroupGpuid, intoStopGroupGpuid: StopGroupGpuid): void {}

  /**
   * @description Merge two stopClusters. It Means moving all stopGroup of a stopCluster into another.
   * Warning: A stopGroup can belong to both stopCluster, in this case, just remove it from the first stopCluster.
   * @param {StopClusterGpuid} stopClusterToMergeGpuid - Ground place unique identifier of the stopCluster to merge.
   * @param {StopClusterGpuid} intoStopClusterGpuid - Ground place unique identifier of the stopCluster to be merged.
   * @returns {void}
   */
  public mergeStopCluster(stopClusterToMergeGpuid: StopClusterGpuid, intoStopClusterGpuid: StopClusterGpuid): void {}

  /**
   * @description Delete StopGroup only if empty.
   * @param {StopGroupGpuid} stopGroupGpuid - Ground place unique identifier of the StopGroup to remove.
   * @returns {void}
   */
  public deleteStopGroup(stopGroupGpuid: StopGroupGpuid): void {}

  /**
   * @description Delete StopCluster only if empty.
   * @param {StopClusterGpuid} stopClusterGpuid - Ground place unique identifier of the StopCluster to remove.
   * @returns {void}
   */
  public deleteStopCluster(stopClusterGpuid: StopClusterGpuid): void {}

  /**
   * @description Getter to retrieve the Ground places.
   * @returns {GroundPlaces}
   */
  public getGroundPlaces(): GroundPlaces {
    return this.storageService.getGroundPlaces();
  }

  /**
   * @description Check if all the business rules are respected.
   * Returns true if everything ok, throw an error with all issues if not.
   * @returns {boolean}
   */
  // @ts-ignore
  private checkValidity(): boolean {}

  /**
   * @description Check the validity of the GroundPlacesDiff structure.
   * Returns true if everything ok, throw an error with all issues if not.
   * @returns {boolean}
   */
  // @ts-ignore
  private checkGroundPlacesDiffValidity(): boolean {}

  /**
   * @description Apply the diff file to the GroundPlacesDiff object.
   * @param {GroundPlacesDiff} groundPlacesDiff - Object that store the history of changes of the GroundPlaces.
   * @returns {void}
   */
  // @ts-ignore
  public applyGroundPlacesDiff(groundPlacesDiff: GroundPlacesDiff): void {
    // Uses all the handling methode to apply the diff
    // This method will be used by the backend (could also be used by front)
    // It should first check the integrity of our ground_places_diff.json
    // Then apply it to the object
    // Then check the integrity of the resulting file
  }
}
