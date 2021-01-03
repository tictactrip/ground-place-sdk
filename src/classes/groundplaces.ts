import * as cloneDeep from 'lodash.clonedeep';
import { Generator as GenerateGpuid } from '@tictactrip/gp-uid';
import { Storage } from '../classes/storage';
import { WebServices } from './webservices';
import {
  StopGroupGpuid,
  StopClusterGpuid,
  CreateGroundPlacesParams,
  UpdateGroundPlaceProperties,
  AutocompleteFilter,
  GroundPlacesDiff,
  GroundPlaceType,
  GroundPlacesFile,
  GroundPlace,
  GroundPlaceServiced,
  StopCluster,
  SegmentProviderStop,
  StopGroup,
  GenerateGpuidGroundPlace,
} from '../types';
import { calculateDistanceBetweenTwoPlaceInKm, parseGeneratePlaceToGroundPlace } from '../helpers';
import { MAX_DISTANCE_BETWEEN_STOP_GROUP_AND_STOP_CLUSTER_IN_KM } from '../constants';

/**
 * @description GroundPlaces business logic.
 */
export class GroundPlacesController {
  private readonly storageService: Storage;
  private readonly webService: WebServices;
  private readonly generateGpuidService: GenerateGpuid;

  /**
   * @description Manipulate GroundPlaces file.
   * @param {string} groundPlacesFile - The file to manipulate, can only be JSON for now.
   */
  constructor() {
    this.storageService = new Storage();
    this.webService = new WebServices();
    this.generateGpuidService = new GenerateGpuid();
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
            const isSegmentProviderExist: boolean = place.childs.some((stopGroupGpuid: StopGroupGpuid) =>
              groundPlaces.find((place: GroundPlace) => place.gpuid === stopGroupGpuid && place.childs.length),
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
   * @param {CreateGroundPlacesParams} createGroundPlaceParams - Parameters that are needed to create a new StopGroup.
   * @param {StopGroupGpuid} stopGroupParentGpuid - Ground place unique identifier of the current StopGroup parent.
   * @param {StopClusterGpuid} stopClusterParentGpuid - Ground place unique identifier of the current StopCluster parent.
   * @param {string} segmentProviderStopId - The identifier of the SegmentProvider used to create the new StopGroup.
   * @returns {void}
   */
  public createStopGroup(
    createGroundPlaceParams: CreateGroundPlacesParams,
    stopGroupParentGpuid: StopGroupGpuid,
    stopClusterParentGpuid: StopClusterGpuid,
    segmentProviderStopId: string,
  ): void {
    const cloneGroundPlaces: GroundPlace[] = cloneDeep(this.getGroundPlaces());

    try {
      const stopGroupCreated: GenerateGpuidGroundPlace = this.generateGpuidService.gpuid({
        ...createGroundPlaceParams,
        type: GroundPlaceType.GROUP,
      });

      const newStopGroup: GroundPlace = parseGeneratePlaceToGroundPlace(stopGroupCreated);

      this.storageService.addPlace(newStopGroup);

      this.moveSegmentProviderStop(segmentProviderStopId, stopGroupParentGpuid, newStopGroup.gpuid);

      // As the new StopGroup have a segmentProviderStop in it (it's not empty), we have to add it to the StopCluster of the old StopGroup parent
      this.addStopGroupToStopCluster(newStopGroup.gpuid, stopClusterParentGpuid);
    } catch (error) {
      // If there is an error, previous update is reverted
      this.storageService.setGroundPlaces(cloneGroundPlaces);

      throw new Error(error.message);
    }
  }

  /**
   * @description Create a new StopCluster from a StopGroup.
   * @param {CreateGroundPlacesParams} createGroundPlaceParams - Params that are needed to create a new StopCluster.
   * @param {StopGroupGpuid} fromStopGroupGpuid - Ground place unique identifier of the StopGroup on which the StopCluster will be created.
   * @returns {void}
   */
  public createStopCluster(
    createGroundPlaceParams: CreateGroundPlacesParams,
    fromStopGroupGpuid: StopGroupGpuid,
  ): void {
    const cloneGroundPlaces: GroundPlace[] = cloneDeep(this.getGroundPlaces());

    try {
      const stopClusterCreated: GenerateGpuidGroundPlace = this.generateGpuidService.gpuid({
        ...createGroundPlaceParams,
        type: GroundPlaceType.CLUSTER,
      });

      const newStopCluster: GroundPlace = parseGeneratePlaceToGroundPlace(stopClusterCreated);

      this.storageService.addPlace(newStopCluster);

      this.addStopGroupToStopCluster(fromStopGroupGpuid, newStopCluster.gpuid);
    } catch (error) {
      // If there is an error, previous update is reverted
      this.storageService.setGroundPlaces(cloneGroundPlaces);

      throw new Error(error.message);
    }
  }

  /**
   * @description Update the stopGroup with the new values given.
   * @param {StopGroupGpuid} stopGroupGpuid - Ground place unique identifier of a StopGroup.
   * @param {UpdateGroundPlaceProperties} propertiesToUpdate - Properties that need to be update.
   * @returns {void}
   */
  public updateStopGroup(stopGroupGpuid: StopGroupGpuid, propertiesToUpdate: UpdateGroundPlaceProperties): void {
    const cloneGroundPlaces: GroundPlace[] = cloneDeep(this.getGroundPlaces());

    try {
      this.storageService.updatePlace(stopGroupGpuid, propertiesToUpdate, GroundPlaceType.GROUP);

      // If latitude and/or longitude have updates wanted, first check that the new distance is correct with the StopCluster parent
      if (propertiesToUpdate.latitude || propertiesToUpdate.longitude) {
        const stopClusterParent: GroundPlace | undefined = cloneGroundPlaces.find(
          (groundPlace: GroundPlace) =>
            groundPlace.type === GroundPlaceType.CLUSTER &&
            groundPlace.childs.some((stopGroupGpuidChild) => stopGroupGpuidChild === stopGroupGpuid),
        );

        // If the StopGroup have a parent, check that the distance is correct
        if (stopClusterParent) {
          const stopGroupUpdated: StopGroup = this.storageService.getStopGroupByGpuid(stopGroupGpuid);

          const distanceInKm: number = calculateDistanceBetweenTwoPlaceInKm(stopGroupUpdated, stopClusterParent);

          if (distanceInKm > MAX_DISTANCE_BETWEEN_STOP_GROUP_AND_STOP_CLUSTER_IN_KM) {
            throw new Error(
              `You can't update the StopGroup with the Gpuid "${stopGroupGpuid}" because it's "${distanceInKm}km" away from the current StopCluster parent (the limit is ${MAX_DISTANCE_BETWEEN_STOP_GROUP_AND_STOP_CLUSTER_IN_KM}km).`,
            );
          }
        }
      }
    } catch (error) {
      // If there is an error, previous update is reverted
      this.storageService.setGroundPlaces(cloneGroundPlaces);

      throw new Error(error.message);
    }
  }

  /**
   * @description Update the stopCluster with the new values given.
   * @param {StopClusterGpuid} stopClusterGpuid - Ground place unique identifier.
   * @param {UpdateGroundPlaceProperties} propertiesToUpdate - Properties that need to be update.
   * @returns {void}
   */
  public updateStopCluster(stopClusterGpuid: StopClusterGpuid, propertiesToUpdate: UpdateGroundPlaceProperties): void {
    const cloneGroundPlaces: GroundPlace[] = cloneDeep(this.getGroundPlaces());

    try {
      this.storageService.updatePlace(stopClusterGpuid, propertiesToUpdate, GroundPlaceType.CLUSTER);

      // If latitude and/or longitude have updates wanted, first check that the new distance is correct with all StopGroup childs
      if (propertiesToUpdate.latitude || propertiesToUpdate.longitude) {
        const stopClusterUpdated: StopCluster = this.storageService.getStopClusterByGpuid(stopClusterGpuid);

        stopClusterUpdated.childs.map((stopGroupGpuid: StopGroupGpuid) => {
          const stopGroup: StopGroup = this.storageService.getStopGroupByGpuid(stopGroupGpuid);

          const distanceInKm: number = calculateDistanceBetweenTwoPlaceInKm(stopGroup, stopClusterUpdated);

          if (distanceInKm > MAX_DISTANCE_BETWEEN_STOP_GROUP_AND_STOP_CLUSTER_IN_KM) {
            throw new Error(
              `You can't update the StopCluster with the Gpuid "${stopClusterGpuid}" because it's "${distanceInKm}km" away from the StopGroup children with the Gpuid "${stopGroupGpuid}" (the limit is ${MAX_DISTANCE_BETWEEN_STOP_GROUP_AND_STOP_CLUSTER_IN_KM}km).`,
            );
          }
        });
      }
    } catch (error) {
      // If there is an error, previous update is reverted
      this.storageService.setGroundPlaces(cloneGroundPlaces);

      throw new Error(error.message);
    }
  }

  /**
   * @description Add a StopGroup to a StopCluster.
   * @param {StopGroupGpuid} stopGroupGpuidToAdd - Ground place unique identifier of the StopGroup to add.
   * @param {StopClusterGpuid} intoStopClusterGpuid - Ground Place unique identifier of the new StopCluster parent.
   * @returns {void}
   */
  public addStopGroupToStopCluster(stopGroupGpuidToAdd: StopGroupGpuid, intoStopClusterGpuid: StopClusterGpuid): void {
    const stopGroupToMove: StopGroup = this.storageService.getStopGroupByGpuid(stopGroupGpuidToAdd);
    const newStopClusterParent: StopCluster = this.storageService.getStopClusterByGpuid(intoStopClusterGpuid);

    // Check if the StopGroup does not already exist in the new StopCluster parent
    const isStopGroupAlreadyExists: boolean = newStopClusterParent.childs.some(
      (stopGroupGpuid: StopGroupGpuid) => stopGroupGpuid === stopGroupGpuidToAdd,
    );

    if (isStopGroupAlreadyExists) {
      throw new Error(
        `The StopGroup with the Gpuid "${stopGroupGpuidToAdd}" cannot be added to the StopCluster with the Gpuid "${intoStopClusterGpuid}" because it already exists in it.`,
      );
    }

    const distanceInKm: number = calculateDistanceBetweenTwoPlaceInKm(stopGroupToMove, newStopClusterParent);

    if (distanceInKm > MAX_DISTANCE_BETWEEN_STOP_GROUP_AND_STOP_CLUSTER_IN_KM) {
      throw new Error(
        `You can't attach the StopGroup with the Gpuid "${stopGroupGpuidToAdd}" to the StopCluster with the Gpuid "${intoStopClusterGpuid}" because they are "${distanceInKm}km" away (the limit is ${MAX_DISTANCE_BETWEEN_STOP_GROUP_AND_STOP_CLUSTER_IN_KM}km).`,
      );
    }

    newStopClusterParent.childs.push(stopGroupGpuidToAdd);

    // Update the place with the new StopCluster parent
    this.storageService.replacePlace(newStopClusterParent);
  }

  /**
   * @description Remove the reference of a StopGroup from a StopCluster.
   * @param {StopGroupGpuid} stopGroupGpuidToRemove - Ground place unique identifier of the StopGroup to remove.
   * @param {StopClusterGpuid} stopClusterGpuidParent - Ground place unique identifier of the StopCluster parent.
   * @returns {void}
   */
  public removeStopGroupFromStopCluster(
    stopGroupGpuidToRemove: StopGroupGpuid,
    stopClusterGpuidParent: StopClusterGpuid,
  ): void {
    const stopClusterParent: StopCluster = this.storageService.getStopClusterByGpuid(stopClusterGpuidParent);
    const groundPlaces: GroundPlace[] = this.getGroundPlaces();
    const cloneGroundPlaces: GroundPlace[] = cloneDeep(this.getGroundPlaces());

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
      (groundPlace: GroundPlace) =>
        groundPlace.type === GroundPlaceType.CLUSTER &&
        groundPlace.childs.find((stopGroupGpuid) => stopGroupGpuid === stopGroupGpuidToRemove),
    );

    // If there is an error, previous update is reverted
    if (!stopGroupExist) {
      this.storageService.setGroundPlaces(cloneGroundPlaces);

      throw new Error(
        `Impossible to remove the StopGroup with the Gpuid "${stopGroupGpuidToRemove}". Make sure that the StopGroup you want to remove will not be without any StopCluster parent after this operation.`,
      );
    }
  }

  /**
   * @description Move a StopGroup from a StopCluster to another StopCluster.
   * @param {StopGroupGpuid} stopGroupToMoveGpuid - Ground place unique identifier of the StopGroup to move.
   * @param {StopClusterGpuid} fromStopClusterGpuid - Ground place unique identifier of the old StopCluster.
   * @param {StopClusterGpuid} intoStopClusterGpuid - Ground place unique identifier of the new StopCluster.
   * @returns {void}
   */
  public moveStopGroup(
    stopGroupToMoveGpuid: StopGroupGpuid,
    fromStopClusterGpuid: StopClusterGpuid,
    intoStopClusterGpuid: StopClusterGpuid,
  ): void {
    if (fromStopClusterGpuid === intoStopClusterGpuid) {
      throw new Error(
        `You can't move the StopGroup with the Gpuid "${stopGroupToMoveGpuid}" because the new StopCluster parent is the same as before.`,
      );
    }

    const cloneGroundPlaces: GroundPlace[] = cloneDeep(this.getGroundPlaces());

    try {
      this.addStopGroupToStopCluster(stopGroupToMoveGpuid, intoStopClusterGpuid);
      this.removeStopGroupFromStopCluster(stopGroupToMoveGpuid, fromStopClusterGpuid);
    } catch (error) {
      // If there is an error, previous update is reverted
      this.storageService.setGroundPlaces(cloneGroundPlaces);

      throw new Error(error.message);
    }
  }

  /**
   * @description Move a SegmentProviderStop from a StopGroup to another StopGroup.
   * @param {string} segmentProviderStopId - The identifier of the SegmentProvider to move.
   * @param {StopGroupGpuid} fromStopGroupGpuid - Ground place unique identifier of the old StopGroup.
   * @param {StopGroupGpuid} intoStopGroupGpuid - Ground place unique identifier of the new StopGroup.
   * @returns {void}
   */
  public moveSegmentProviderStop(
    segmentProviderStopId: string,
    fromStopGroupGpuid: StopGroupGpuid,
    intoStopGroupGpuid: StopGroupGpuid,
  ): void {
    if (fromStopGroupGpuid === intoStopGroupGpuid) {
      throw new Error(
        `You can't move the SegmentProviderStop with the ID "${segmentProviderStopId}" because the new StopGroup parent is the same as the current one.`,
      );
    }

    const cloneGroundPlaces: GroundPlace[] = cloneDeep(this.getGroundPlaces());

    try {
      const currentStopGroupParent: StopGroup = this.storageService.getStopGroupByGpuid(fromStopGroupGpuid);
      const newStopGroupParent: StopGroup = this.storageService.getStopGroupByGpuid(intoStopGroupGpuid);

      const segmentProviderStopIndex: number = currentStopGroupParent.childs.findIndex(
        ({ id }: SegmentProviderStop) => id === segmentProviderStopId,
      );

      // Check if the SegmentProviderStop to move currently exist inside the current StopGroup parent specified
      if (segmentProviderStopIndex === -1) {
        throw new Error(
          `The SegmentProviderStop with the ID "${segmentProviderStopId}" doesn't exists inside the StopGroup with the Gpuid "${fromStopGroupGpuid}".`,
        );
      }

      const segmentProviderStop: SegmentProviderStop = currentStopGroupParent.childs[segmentProviderStopIndex];

      const isAlreadyBelongToNewStopGroup: boolean = newStopGroupParent.childs.some(
        ({ company_name }: SegmentProviderStop) => company_name === segmentProviderStop.company_name,
      );

      // Check if the SegmentProviderStop to move don't already exist inside the new StopGroup parent specified
      if (isAlreadyBelongToNewStopGroup) {
        throw new Error(
          `The SegmentProviderStop ID "${segmentProviderStopId}" with the segmentProvider "${segmentProviderStop.company_name}" can't be move because it already exists inside the new StopGroup parent with the Gpuid "${intoStopGroupGpuid}".`,
        );
      }

      // Remove segmentProviderStop from the current StopGroup parent
      currentStopGroupParent.childs.splice(segmentProviderStopIndex, 1);

      // Add segmentProviderStop into the new one
      newStopGroupParent.childs.push(segmentProviderStop);

      // Update the two StopGroup related
      this.storageService.replacePlace(currentStopGroupParent);
      this.storageService.replacePlace(newStopGroupParent);
    } catch (error) {
      // If there is an error, previous update is reverted
      this.storageService.setGroundPlaces(cloneGroundPlaces);

      throw new Error(error.message);
    }
  }

  /**
   * @description Merge two stopGroups. It means moving all SegmentProviderStop of a StopGroup into another.
   * @param {StopGroupGpuid} stopGroupToMergeGpuid - Ground place unique identifier of the StopGroup to merge.
   * @param {StopGroupGpuid} intoStopGroupGpuid - Ground Place unique identifier of the StopGroup to be merged.
   * @returns {void}
   */
  public mergeStopGroup(stopGroupToMergeGpuid: StopGroupGpuid, intoStopGroupGpuid: StopGroupGpuid): void {
    if (stopGroupToMergeGpuid === intoStopGroupGpuid) {
      throw new Error(
        `You can't "merge" these two StopGroup with the Gpuid "${stopGroupToMergeGpuid}" because they are the same.`,
      );
    }

    const cloneGroundPlaces: GroundPlace[] = cloneDeep(this.getGroundPlaces());

    try {
      const stopGroupToMerge: StopGroup = this.storageService.getStopGroupByGpuid(stopGroupToMergeGpuid);

      stopGroupToMerge.childs.map(({ id: segmentProviderStopId }: SegmentProviderStop) =>
        this.moveSegmentProviderStop(segmentProviderStopId, stopGroupToMergeGpuid, intoStopGroupGpuid),
      );
    } catch (error) {
      // If there is an error, previous update is reverted
      this.storageService.setGroundPlaces(cloneGroundPlaces);

      throw new Error(error.message);
    }
  }

  /**
   * @description Merge two stopClusters. It Means moving all stopGroup of a stopCluster into another.
   * @param {StopClusterGpuid} stopClusterToMergeGpuid - Ground place unique identifier of the stopCluster to merge.
   * @param {StopClusterGpuid} intoStopClusterGpuid - Ground place unique identifier of the stopCluster to be merged.
   * @returns {void}
   */
  public mergeStopCluster(stopClusterToMergeGpuid: StopClusterGpuid, intoStopClusterGpuid: StopClusterGpuid): void {
    if (stopClusterToMergeGpuid === intoStopClusterGpuid) {
      throw new Error(
        `You can't "merge" these two StopCluster with the Gpuid "${stopClusterToMergeGpuid}" because they are the same.`,
      );
    }

    const cloneGroundPlaces: GroundPlace[] = cloneDeep(this.getGroundPlaces());

    try {
      const stopClusterToMerge: StopCluster = this.storageService.getStopClusterByGpuid(stopClusterToMergeGpuid);
      const intoStopCluster: StopCluster = this.storageService.getStopClusterByGpuid(intoStopClusterGpuid);

      stopClusterToMerge.childs.map((stopGroupGpuid: StopGroupGpuid) => {
        // Since a StopGroup can belong to both StopCluster
        // We need to check if its currently exist in both of them
        const isStopGroupAlreadyExists: boolean = intoStopCluster.childs.some(
          (stopGroupGpuidFromNewCluster: StopGroupGpuid) => stopGroupGpuidFromNewCluster === stopGroupGpuid,
        );

        // If its the case, only remove it from the first StopCluster
        if (isStopGroupAlreadyExists) {
          this.removeStopGroupFromStopCluster(stopGroupGpuid, stopClusterToMergeGpuid);
          // If not, move it from the first StopCluster and remove it from it
        } else {
          this.moveStopGroup(stopGroupGpuid, stopClusterToMergeGpuid, intoStopClusterGpuid);
        }
      });
    } catch (error) {
      // If there is an error, previous update is reverted
      this.storageService.setGroundPlaces(cloneGroundPlaces);

      throw new Error(error.message);
    }
  }

  /**
   * @description Delete StopGroup only if it does not contains SegmentProviderStop.
   * @param {StopGroupGpuid} stopGroupGpuid - Ground place unique identifier of the StopGroup to remove.
   * @returns {void}
   */
  public deleteStopGroup(stopGroupGpuid: StopGroupGpuid): void {
    this.storageService.deletePlace(stopGroupGpuid, GroundPlaceType.GROUP);
  }

  /**
   * @description Delete StopCluster only if it does not contains StopGroup.
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
   * @description Download the GroundPlacesDiff file in JSON and store it on Desktop.
   * @returns {void}
   */
  public downloadGroundPlacesDiffToDesktop(): void {}

  /**
   * @description Download the GroundPlaces file in JSON and store it on Desktop.
   * @returns {void}
   */
  public downloadGroundPlacesFileToDesktop(): void {}

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
   * @description Check the validity of the GroundPlacesDiff structure.
   *
   * Returns true if everything ok, throw an error with all issues if not.
   * @returns {boolean}
   */
  // @ts-ignore
  private checkGroundPlacesDiffValidity(): boolean {}
}
