import * as cloneDeep from 'lodash.clonedeep';
import { Storage } from '../classes/storage';
import { WebServices } from './webservices';
import {
  StopGroupGpuid,
  StopClusterGpuid,
  CreateStopGroupProperties,
  CreateStopClusterProperties,
  UpdateStopProperties,
  AutocompleteFilter,
  GroundPlacesDiff,
  GroundPlaceType,
  GroundPlacesFile,
  GroundPlace,
  GroundPlaceServiced,
  StopCluster,
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
   * @param {GroundPlacesFile|undefined} groundPlacesFile
   * The file to manipulate, can only be JSON for now.
   *
   * If you provide empty value, the default file will be the file retrieved from Amazon S3.
   * @returns {void}
   */
  public init(groundPlacesFile?: GroundPlacesFile): void {
    if (groundPlacesFile) {
      this.storageService.initFile(groundPlacesFile);
    } else {
      const groundPlacesFileS3: GroundPlacesFile = this.webService.downloadDistantGroundPlacesMaster();

      this.storageService.initFile(groundPlacesFileS3);
    }
  }

  /**
   * @description Returns a list of ground places.
   * @param {string} query - Can be a name, a Gpuid, a unique name or other name.
   * @param {AutoCompleteFilters[]|undefined} filters - Filters with different options (StopGroup, StopCluster, Serviced, SegmentProvider).
   *
   * If you do not give filters, the list will not be filtered.
   * @returns {GroundPlace[]}
   */
  public autocomplete(query: string, filters?: AutocompleteFilter[]): GroundPlace[] {
    const groundPlaces: GroundPlace[] = this.getGroundPlaces();

    // Method toLowerCase() is used because the includes() method is case sensitive
    const currentQuery: string = query.toLowerCase();

    const isFilterByStopGroupActive: boolean = filters?.includes(AutocompleteFilter.STOP_GROUP);
    const isFilterByStopClusterActive: boolean = filters?.includes(AutocompleteFilter.STOP_CLUSTER);
    const isFilterByServicedActive: boolean = filters?.includes(AutocompleteFilter.SERVICED);
    const isFilterWithChildrenActive: boolean = filters?.includes(AutocompleteFilter.SEGMENT_PROVIDER_STOP);

    return groundPlaces.filter(
      (place: GroundPlace): GroundPlace => {
        // Checking that the place matching the search query
        if (
          !place.gpuid.toLowerCase().includes(currentQuery) &&
          !place.name.toLowerCase().includes(currentQuery) &&
          !(place.type === GroundPlaceType.CLUSTER && place.unique_name.toLowerCase().includes(currentQuery))
        ) {
          return;
        }

        // Return the place earlier if there is no filters to use
        if (!filters || !filters.length) {
          return place;
        }

        if (
          (isFilterByStopGroupActive && place.type !== GroundPlaceType.GROUP) ||
          (isFilterByStopClusterActive && place.type !== GroundPlaceType.CLUSTER) ||
          (isFilterByServicedActive && place.serviced !== GroundPlaceServiced.TRUE)
        ) {
          return;
        }

        if (isFilterWithChildrenActive) {
          // Since StopGroups and StopClusters do not share the same structure
          // We have to search the StopGroups from the StopCluster parent
          // In order to find potential segmentProviderStop in childrens
          if (place.type === GroundPlaceType.CLUSTER) {
            const isSegmentProviderExist: StopGroupGpuid | undefined = place.childs.find(
              (stopGroupGpuid: StopGroupGpuid): GroundPlace =>
                groundPlaces.find((place: GroundPlace): boolean =>
                  Boolean(place.gpuid === stopGroupGpuid && place.childs.length),
                ),
            );

            if (!isSegmentProviderExist) {
              return;
            }
          } else if (place.type === GroundPlaceType.GROUP && !place.childs.length) {
            return;
          }
        }

        return place;
      },
    );
  }

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
    const cloneGroundPlaces: GroundPlace[] = cloneDeep(this.storageService.getGroundPlaces());

    try {
      this.storageService.updatePlace(stopGroupGpuid, propertiesToUpdate, GroundPlaceType.GROUP);
    } catch (error) {
      // If there is error in the process, rollback to the previous version of the ground places stored
      this.storageService.setGroundPlaces(cloneGroundPlaces);

      throw new Error(error.message);
    }
  }

  /**
   * @description Update the stopCluster with the new values given.
   * @param {StopClusterGpuid} stopClusterGpuid - Ground place unique identifier.
   * @param {UpdateStopProperties} propertiesToUpdate - Properties that need to be update.
   * @returns {void}
   */
  public updateStopCluster(stopClusterGpuid: StopClusterGpuid, propertiesToUpdate: UpdateStopProperties): void {
    const cloneGroundPlaces: GroundPlace[] = cloneDeep(this.storageService.getGroundPlaces());

    try {
      this.storageService.updatePlace(stopClusterGpuid, propertiesToUpdate, GroundPlaceType.CLUSTER);
    } catch (error) {
      // If there is error in the process, rollback to the previous version of the ground places stored
      this.storageService.setGroundPlaces(cloneGroundPlaces);

      throw new Error(error.message);
    }
  }

  /**
   * @description Move a segmentProviderStop from a stopGroup to another stopGroup.
   *
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
   * @description Add a stopGroup to a stopCluster.
   * @param {StopGroupGpuid} stopGroupGpuidToAdd - Ground place unique identifier of the StopGroup to add.
   * @param {StopClusterGpuid} intoStopClusterGpuid - Ground Place unique identifier of the new StopCluster parent.
   * @returns {void}
   */
  public addStopGroupToStopCluster(stopGroupGpuidToAdd: StopGroupGpuid, intoStopClusterGpuid: StopClusterGpuid): void {
    // Check if the StopGroup specified exists in the Ground places
    this.storageService.getStopGroupByGpuid(stopGroupGpuidToAdd);

    const stopClusterParent: StopCluster = this.storageService.getStopClusterByGpuid(intoStopClusterGpuid);

    // Check if the StopGroup does not already exist in the new StopCluster parent
    const isStopGroupAlreadyExists = Boolean(
      stopClusterParent.childs.find((stopGroupGpuid: StopGroupGpuid) => stopGroupGpuid === stopGroupGpuidToAdd),
    );

    if (isStopGroupAlreadyExists) {
      throw new Error(
        `The StopGroup with the Gpuid "${stopGroupGpuidToAdd}" cannot be added to the StopCluster with the Gpuid "${intoStopClusterGpuid}" because it already exists in it.`,
      );
    }

    stopClusterParent.childs.push(stopGroupGpuidToAdd);

    // Update the place with the new StopCluster parent
    this.storageService.replacePlace(stopClusterParent);
  }

  /**
   * @description Remove a stopGroup from a stopCluster.
   *
   * Warning: The StopGroup cannot be without StopCluster parent after this operation.
   * @param {StopGroupGpuid} stopGroupGpuidToRemove - Ground place unique identifier of the SopGroup to remove.
   * @param {StopClusterGpuid} stopClusterGpuidParent - Ground place unique identifier of the StopCluster parent.
   * @returns {void}
   */
  public removeStopGroupFromStopCluster(
    stopGroupGpuidToRemove: StopGroupGpuid,
    stopClusterGpuidParent: StopClusterGpuid,
  ): void {
    const stopClusterParent: StopCluster = this.storageService.getStopClusterByGpuid(stopClusterGpuidParent);
    const groundPlaces: GroundPlace[] = this.storageService.getGroundPlaces();
    const cloneGroundPlaces: GroundPlace[] = cloneDeep(this.storageService.getGroundPlaces());

    const stopGroupIndex: number = stopClusterParent.childs.findIndex(
      (stopGroupGpuid: StopGroupGpuid) => stopGroupGpuid === stopGroupGpuidToRemove,
    );

    if (stopGroupIndex === -1) {
      throw new Error(
        `The StopGroup with the Gpuid "${stopGroupGpuidToRemove}" cannot be removed from the StopCluster with the Gpuid "${stopClusterGpuidParent}" because it does not belong to it.`,
      );
    }

    // Remove the reference of the StopGroup Gpuid inside the StopCluster parent
    stopClusterParent.childs.splice(stopGroupIndex, 1);

    // Update the place with the new StopCluster parent
    this.storageService.replacePlace(stopClusterParent);

    // Check if the StopGroup is not orphan after the operation
    const stopGroupExist: boolean = groundPlaces.some(
      (groundPlace: GroundPlace): string =>
        groundPlace.type === GroundPlaceType.CLUSTER &&
        groundPlace.childs.find((stopGroupGpuid) => stopGroupGpuid === stopGroupGpuidToRemove),
    );

    // If the StopGroup is orphan, rollback to the previous version of the ground places stored
    if (!stopGroupExist) {
      this.storageService.setGroundPlaces(cloneGroundPlaces);

      throw new Error(
        `Impossible to remove the StopGroup with the Gpuid "${stopGroupGpuidToRemove}". Make sure that the StopGroup you want to remove will not be without any StopCluster parent after this operation.`,
      );
    }
  }

  /**
   * @description Move a stopGroup from a stopCluster to another stopCluster.
   * @param {StopGroupGpuid} stopGroupToMoveGpuid - Ground place unique identifier of the stopGroup to move.
   * @param {StopClusterGpuid} fromStopClusterGpuid - Ground place unique identifier of the old stopCluster.
   * @param {StopClusterGpuid} intoStopClusterGpuid - Ground place unique identifier of the new stopCluster.
   * @returns {void}
   */
  public moveStopGroup(
    stopGroupToMoveGpuid: StopGroupGpuid,
    fromStopClusterGpuid: StopClusterGpuid,
    intoStopClusterGpuid: StopClusterGpuid,
  ): void {
    if (fromStopClusterGpuid === intoStopClusterGpuid) {
      throw new Error(
        `You can't move the StopGroup with the Gpuid "${stopGroupToMoveGpuid}" because it already exists inside the new StopCluster parent specified.`,
      );
    }

    const cloneGroundPlaces: GroundPlace[] = cloneDeep(this.storageService.getGroundPlaces());

    try {
      this.addStopGroupToStopCluster(stopGroupToMoveGpuid, intoStopClusterGpuid);
      this.removeStopGroupFromStopCluster(stopGroupToMoveGpuid, fromStopClusterGpuid);
    } catch (error) {
      // If there is error in the process, rollback to the previous version of the ground places stored
      this.storageService.setGroundPlaces(cloneGroundPlaces);

      throw new Error(error.message);
    }
  }

  /**
   * @description Merge two stopGroups. It means moving all segmentProviderStop of a stopGroup into another.
   *
   * Warning: Check first if the merged stopGroup don't have two segmentProviderStop of the same segmentProvider in it.
   * @param {StopGroupGpuid} stopGroupToMergeGpuid - Ground place unique identifier of the stopGroup to merge.
   * @param {StopGroupGpuid} intoStopGroupGpuid - Ground Place unique identifier of the stopGroup to be merged.
   * @returns {void}
   */
  public mergeStopGroup(stopGroupToMergeGpuid: StopGroupGpuid, intoStopGroupGpuid: StopGroupGpuid): void {}

  /**
   * @description Merge two stopClusters. It Means moving all stopGroup of a stopCluster into another.
   *
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
  public deleteStopGroup(stopGroupGpuid: StopGroupGpuid): void {
    this.storageService.deletePlace(stopGroupGpuid, GroundPlaceType.GROUP);
  }

  /**
   * @description Delete StopCluster only if empty.
   * @param {StopClusterGpuid} stopClusterGpuid - Ground place unique identifier of the StopCluster to remove.
   * @returns {void}
   */
  public deleteStopCluster(stopClusterGpuid: StopClusterGpuid): void {
    this.storageService.deletePlace(stopClusterGpuid, GroundPlaceType.CLUSTER);
  }

  /**
   * @description Getter to retrieve the Ground places.
   * @returns {GroundPlace[]}
   */
  public getGroundPlaces(): GroundPlace[] {
    return this.storageService.getGroundPlaces();
  }

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

  /**
   * @description Check if all the business rules are respected.
   *
   * Returns true if everything ok, throw an error with all issues if not.
   * @returns {boolean}
   */
  // @ts-ignore
  private checkValidity(): boolean {
    // TODO: Implement this
    return true;
  }

  /**
   * @description Check the validity of the GroundPlacesDiff structure.
   *
   * Returns true if everything ok, throw an error with all issues if not.
   * @returns {boolean}
   */
  // @ts-ignore
  private checkGroundPlacesDiffValidity(): boolean {}
}
