import * as cloneDeep from 'lodash.clonedeep';
import { Generator as GenerateGpuid } from '@tictactrip/gp-uid';
import { Storage } from '../classes/storage';
import {
  Gpuid,
  StopGroupGpuid,
  StopClusterGpuid,
  CreateGroundPlacesParams,
  UpdateGroundPlaceProperties,
  AutocompleteFilter,
  GroundPlaceType,
  GroundPlacesFile,
  GroundPlace,
  GroundPlaceServiced,
  StopCluster,
  SegmentProviderStop,
  StopGroup,
  GenerateGpuidGroundPlace,
  ActionType,
  GroundPlaceActionHistory,
  GroundPlaceActionOptions,
  CreateActionHistory,
} from '../types';
import {
  calculateDistanceBetweenTwoPlaceInKm,
  parseGeneratePlaceToGroundPlace,
  sanitizeGroundPlacePropertiesToUpdate,
} from '../helpers';
import { MAX_DISTANCE_BETWEEN_STOP_GROUP_AND_STOP_CLUSTER_IN_KM } from '../constants';

/**
 * @description GroundPlaces business logic.
 */
export class GroundPlacesController {
  private readonly storageService: Storage;
  private readonly generateGpuidService: GenerateGpuid;

  /**
   * @constructor Manipulate GroundPlaces file.
   */
  constructor() {
    this.storageService = new Storage();
    this.generateGpuidService = new GenerateGpuid();
  }

  /**
   * @description Init GroundPlaces file.
   * @param {GroundPlacesFile} groundPlacesFile
   * @returns {void}
   */
  public init(groundPlacesFile: GroundPlacesFile): void {
    this.storageService.initFile(groundPlacesFile);
  }

  /**
   * @description Returns the StopGroup identified by its Gpuid.
   * @param {StopGroupGpuid} stopGroupGpuid - Ground Place unique identifier of the StopGroup to find.
   * @returns {StopGroup}
   */
  public getStopGroupByGpuid(stopGroupGpuid: StopGroupGpuid): StopGroup {
    return this.storageService.getStopGroupByGpuid(stopGroupGpuid);
  }

  /**
   * @description Returns the StopCluster identified by its Gpuid.
   * @param {StopClusterGpuid} stopClusterGpuid - Ground place unique identifier of the StopCluster to find.
   * @returns {StopCluster}
   */
  public getStopClusterByGpuid(stopClusterGpuid: StopClusterGpuid): StopCluster {
    return this.storageService.getStopClusterByGpuid(stopClusterGpuid);
  }

  /**
   * @description Find the correct place based on the Ground place unique identifier provided and the type of the place.
   * @param {Gpuid} groundPlaceGpuid - Ground place unique identifier of the place to search.
   * @param {GroundPlaceType} placeType - The type of the place to search, can be StopGroup or StopCluster.
   */
  public getGroundPlaceByGpuid(groundPlaceGpuid: Gpuid, placeType: GroundPlaceType): GroundPlace {
    return this.storageService.getGroundPlaceByGpuid(groundPlaceGpuid, placeType);
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

    return groundPlaces.filter(
      (place: GroundPlace): GroundPlace => {
        // Checking that the place matching the search query
        if (
          !place.gpuid.toLowerCase().includes(currentQuery) &&
          !place.name.toLowerCase().includes(currentQuery) &&
          !(place.type === GroundPlaceType.CLUSTER && place.unique_name.toLowerCase().includes(currentQuery)) &&
          !(
            place.type === GroundPlaceType.GROUP &&
            place.childs.some((segmentProviderStop: SegmentProviderStop) =>
              segmentProviderStop.name.toLowerCase().includes(currentQuery),
            )
          )
        ) {
          return;
        }

        // Return the place earlier if there is no filters to use
        if (!filters || !filters.length) {
          return place;
        }

        if (
          (isFilterByStopGroupActive && !isFilterByStopClusterActive && place.type !== GroundPlaceType.GROUP) ||
          (isFilterByStopClusterActive && !isFilterByStopGroupActive && place.type !== GroundPlaceType.CLUSTER) ||
          (isFilterByServicedActive && place.serviced !== GroundPlaceServiced.TRUE)
        ) {
          return;
        }

        return place;
      },
    );
  }

  /**
   * @description Create a new StopGroup from a SegmentProviderStop.
   * @param {string} segmentProviderStopId - The identifier of the SegmentProviderStop used to create the new StopGroup.
   * @param {StopGroupGpuid} fromStopGroupGpuid - Ground place unique identifier of the current StopGroup parent.
   * @param {CreateGroundPlacesParams} createGroundPlaceParams - Parameters that are needed to create a new StopGroup.
   * @returns {void}
   */
  public createStopGroup(
    segmentProviderStopId: string,
    fromStopGroupGpuid: StopGroupGpuid,
    createGroundPlaceParams: CreateGroundPlacesParams,
  ): void {
    if (
      !segmentProviderStopId ||
      !fromStopGroupGpuid ||
      !createGroundPlaceParams.countryCode ||
      !createGroundPlaceParams.latitude ||
      !createGroundPlaceParams.longitude ||
      !createGroundPlaceParams.name
    ) {
      throw new Error(
        'Error while creating a new StopGroup, please check that you have provide all properties needed (segmentProviderId, fromStopGroupGpuid, countryCode, latitude, longitude and name).',
      );
    }

    const cloneGroundPlaces: GroundPlace[] = cloneDeep(this.getGroundPlaces());

    try {
      const stopGroupCreated: GenerateGpuidGroundPlace = this.generateGpuidService.gpuid({
        ...createGroundPlaceParams,
        type: GroundPlaceType.GROUP,
      });

      const newStopGroup: GroundPlace = parseGeneratePlaceToGroundPlace(stopGroupCreated);

      this.storageService.addPlace(newStopGroup);

      this.internalMoveSegmentProviderStop(
        segmentProviderStopId,
        fromStopGroupGpuid,
        newStopGroup.gpuid,
        CreateActionHistory.FALSE,
      );

      // As the new StopGroup have a segmentProviderStop in it (it's not empty), we have to add it inside all its potential StopCluster parents
      const stopClusterParent: GroundPlace[] = cloneGroundPlaces.filter(
        (groundPlace: GroundPlace) =>
          groundPlace.type === GroundPlaceType.CLUSTER &&
          groundPlace.childs.some((stopGroupGpuidChild: StopGroupGpuid) => stopGroupGpuidChild === fromStopGroupGpuid),
      );

      stopClusterParent.map(({ gpuid: stopClusterGpuid }: StopCluster) =>
        this.internalAddStopGroupToStopCluster(newStopGroup.gpuid, stopClusterGpuid, CreateActionHistory.FALSE),
      );
    } catch (error) {
      // If there is an error, previous update is reverted
      this.storageService.setGroundPlaces(cloneGroundPlaces);

      throw new Error(error.message);
    }

    this.storageService.addGroundPlaceActionHistory(fromStopGroupGpuid, {
      type: ActionType.CREATE_STOP_GROUP,
      params: {
        segmentProviderStopId,
        ...createGroundPlaceParams,
      },
    });
  }

  /**
   * @description Create a new StopCluster from a StopGroup.
   * @param {StopGroupGpuid} fromStopGroupGpuid - Ground place unique identifier of the StopGroup on which the StopCluster will be created.
   * @param {CreateGroundPlacesParams} createGroundPlaceParams - Params that are needed to create a new StopCluster.
   * @returns {void}
   */
  public createStopCluster(
    fromStopGroupGpuid: StopGroupGpuid,
    createGroundPlaceParams: CreateGroundPlacesParams,
  ): void {
    if (
      !fromStopGroupGpuid ||
      !createGroundPlaceParams.countryCode ||
      !createGroundPlaceParams.latitude ||
      !createGroundPlaceParams.longitude ||
      !createGroundPlaceParams.name
    ) {
      throw new Error(
        'Error while creating a new StopCluster, please check that you have provide all properties needed (fromStopGroupGpuid, countryCode, latitude, longitude and name).',
      );
    }

    const cloneGroundPlaces: GroundPlace[] = cloneDeep(this.getGroundPlaces());

    try {
      const stopClusterCreated: GenerateGpuidGroundPlace = this.generateGpuidService.gpuid({
        ...createGroundPlaceParams,
        type: GroundPlaceType.CLUSTER,
      });

      const newStopCluster: GroundPlace = parseGeneratePlaceToGroundPlace(stopClusterCreated);

      this.storageService.addPlace(newStopCluster);

      this.internalAddStopGroupToStopCluster(fromStopGroupGpuid, newStopCluster.gpuid, CreateActionHistory.FALSE);
    } catch (error) {
      // If there is an error, previous update is reverted
      this.storageService.setGroundPlaces(cloneGroundPlaces);

      throw new Error(error.message);
    }

    this.storageService.addGroundPlaceActionHistory(fromStopGroupGpuid, {
      type: ActionType.CREATE_STOP_CLUSTER,
      params: {
        ...createGroundPlaceParams,
      },
    });
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

    this.storageService.addGroundPlaceActionHistory(stopGroupGpuid, {
      type: ActionType.UPDATE_STOP_GROUP,
      params: {
        ...propertiesToUpdate,
      },
    });
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

    this.storageService.addGroundPlaceActionHistory(stopClusterGpuid, {
      type: ActionType.UPDATE_STOP_CLUSTER,
      params: {
        ...propertiesToUpdate,
      },
    });
  }
  /**
   * @description Add a StopGroup to a StopCluster.
   * @param {StopGroupGpuid} stopGroupGpuidToAdd - Ground place unique identifier of the StopGroup to add.
   * @param {StopClusterGpuid} intoStopClusterGpuid - Ground Place unique identifier of the new StopCluster parent.
   * @returns {void}
   */
  public addStopGroupToStopCluster(stopGroupGpuidToAdd: StopGroupGpuid, intoStopClusterGpuid: StopClusterGpuid): void {
    /* Since 'addStopGroupToStopCluster' can be used both by the user of the package and other method that handle places.
    We need to create another method that will handle the creation or not of an ActionHistory from this method. */
    this.internalAddStopGroupToStopCluster(stopGroupGpuidToAdd, intoStopClusterGpuid, CreateActionHistory.TRUE);
  }

  /**
   * @description Add a StopGroup to a StopCluster (with ActionHistory switchable).
   * @param {StopGroupGpuid} stopGroupGpuidToAdd - Ground place unique identifier of the StopGroup to add.
   * @param {StopClusterGpuid} intoStopClusterGpuid - Ground Place unique identifier of the new StopCluster parent.
   * @param {CreateActionHistory} createActionHistory - Emit or not an ActionHistory.
   * @returns {void}
   */
  private internalAddStopGroupToStopCluster(
    stopGroupGpuidToAdd: StopGroupGpuid,
    intoStopClusterGpuid: StopClusterGpuid,
    createActionHistory: CreateActionHistory,
  ): void {
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

    if (createActionHistory === CreateActionHistory.TRUE) {
      this.storageService.addGroundPlaceActionHistory(stopGroupGpuidToAdd, {
        type: ActionType.ADD_STOP_GROUP_TO_STOP_CLUSTER,
        into: intoStopClusterGpuid,
      });
    }
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
    /* Since 'removeStopGroupFromStopCluster' can be used both by the user of the package and other method that handle places.
    We need to create another method that will handle the creation or not of an ActionHistory from this method. */
    this.internalRemoveStopGroupFromStopCluster(
      stopGroupGpuidToRemove,
      stopClusterGpuidParent,
      CreateActionHistory.TRUE,
    );
  }

  /**
   * @description Remove the reference of a StopGroup from a StopCluster (with ActionHistory switchable).
   * @param {StopGroupGpuid} stopGroupGpuidToRemove - Ground place unique identifier of the StopGroup to remove.
   * @param {StopClusterGpuid} stopClusterGpuidParent - Ground place unique identifier of the StopCluster parent.
   * @param {CreateActionHistory} createActionHistory - Emit or not an ActionHistory.
   * @returns {void}
   */
  private internalRemoveStopGroupFromStopCluster(
    stopGroupGpuidToRemove: StopGroupGpuid,
    stopClusterGpuidParent: StopClusterGpuid,
    createActionHistory: CreateActionHistory,
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

    if (createActionHistory === CreateActionHistory.TRUE) {
      this.storageService.addGroundPlaceActionHistory(stopGroupGpuidToRemove, {
        type: ActionType.REMOVE_STOP_GROUP_FROM_STOP_CLUSTER,
        from: stopClusterGpuidParent,
      });
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
    /* Since 'moveStopGroup' can be used both by the user of the package and other method that handle places.
    We need to create another method that will handle the creation or not of an ActionHistory from this method. */
    this.internalMoveStopGroup(
      stopGroupToMoveGpuid,
      fromStopClusterGpuid,
      intoStopClusterGpuid,
      CreateActionHistory.TRUE,
    );
  }

  /**
   * @description Move a StopGroup from a StopCluster to another StopCluster (with ActionHistory switchable).
   * @param {StopGroupGpuid} stopGroupToMoveGpuid - Ground place unique identifier of the StopGroup to move.
   * @param {StopClusterGpuid} fromStopClusterGpuid - Ground place unique identifier of the old StopCluster.
   * @param {StopClusterGpuid} intoStopClusterGpuid - Ground place unique identifier of the new StopCluster.
   * @param {CreateActionHistory} createActionHistory - Emit or not an ActionHistory.
   * @returns {void}
   */
  private internalMoveStopGroup(
    stopGroupToMoveGpuid: StopGroupGpuid,
    fromStopClusterGpuid: StopClusterGpuid,
    intoStopClusterGpuid: StopClusterGpuid,
    createActionHistory: CreateActionHistory,
  ): void {
    if (fromStopClusterGpuid === intoStopClusterGpuid) {
      throw new Error(
        `You can't move the StopGroup with the Gpuid "${stopGroupToMoveGpuid}" because the new StopCluster parent is the same as before.`,
      );
    }

    const cloneGroundPlaces: GroundPlace[] = cloneDeep(this.getGroundPlaces());

    try {
      this.internalAddStopGroupToStopCluster(stopGroupToMoveGpuid, intoStopClusterGpuid, CreateActionHistory.FALSE);
      this.internalRemoveStopGroupFromStopCluster(
        stopGroupToMoveGpuid,
        fromStopClusterGpuid,
        CreateActionHistory.FALSE,
      );
    } catch (error) {
      // If there is an error, previous update is reverted
      this.storageService.setGroundPlaces(cloneGroundPlaces);

      throw new Error(error.message);
    }

    if (createActionHistory === CreateActionHistory.TRUE) {
      this.storageService.addGroundPlaceActionHistory(stopGroupToMoveGpuid, {
        type: ActionType.MOVE_STOP_GROUP,
        from: fromStopClusterGpuid,
        into: intoStopClusterGpuid,
      });
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
    /* Since 'moveSegmentProviderStop' can be used both by the user of the package and other method that handle places.
    We need to create another method that will handle the creation or not of an ActionHistory from this method. */
    this.internalMoveSegmentProviderStop(
      segmentProviderStopId,
      fromStopGroupGpuid,
      intoStopGroupGpuid,
      CreateActionHistory.TRUE,
    );
  }

  /**
   * @description Move a SegmentProviderStop from a StopGroup to another StopGroup (with ActionHistory switchable).
   * @param {string} segmentProviderStopId - The identifier of the SegmentProvider to move.
   * @param {StopGroupGpuid} fromStopGroupGpuid - Ground place unique identifier of the old StopGroup.
   * @param {StopGroupGpuid} intoStopGroupGpuid - Ground place unique identifier of the new StopGroup.
   * @param {CreateActionHistory} createActionHistory - Emit or not an ActionHistory.
   * @returns {void}
   */
  private internalMoveSegmentProviderStop(
    segmentProviderStopId: string,
    fromStopGroupGpuid: StopGroupGpuid,
    intoStopGroupGpuid: StopGroupGpuid,
    createActionHistory: CreateActionHistory,
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

      // Check if the new StopGroup specified is already serves by the SegmentProvider of the SegmentProviderStop to move
      if (isAlreadyBelongToNewStopGroup) {
        throw new Error(
          `The SegmentProviderStop ID "${segmentProviderStopId}" with the SegmentProvider "${segmentProviderStop.company_name}" can't be move because the SegmentProvider "${segmentProviderStop.company_name}" already exists inside the new StopGroup parent with the Gpuid "${intoStopGroupGpuid}".`,
        );
      }

      const distanceInKm: number = calculateDistanceBetweenTwoPlaceInKm(currentStopGroupParent, newStopGroupParent);

      if (distanceInKm > MAX_DISTANCE_BETWEEN_STOP_GROUP_AND_STOP_CLUSTER_IN_KM) {
        throw new Error(
          `You can't move the SegmentProviderStop with the ID "${segmentProviderStopId}" inside the StopGroup with the Gpuid "${intoStopGroupGpuid}" because they are "${distanceInKm}km" away (the limit is ${MAX_DISTANCE_BETWEEN_STOP_GROUP_AND_STOP_CLUSTER_IN_KM}km).`,
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

    if (createActionHistory === CreateActionHistory.TRUE) {
      this.storageService.addGroundPlaceActionHistory(fromStopGroupGpuid, {
        type: ActionType.MOVE_SEGMENT_PROVIDER_STOP,
        into: intoStopGroupGpuid,
        params: {
          segmentProviderStopId,
        },
      });
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
        this.internalMoveSegmentProviderStop(
          segmentProviderStopId,
          stopGroupToMergeGpuid,
          intoStopGroupGpuid,
          CreateActionHistory.FALSE,
        ),
      );
    } catch (error) {
      // If there is an error, previous update is reverted
      this.storageService.setGroundPlaces(cloneGroundPlaces);

      throw new Error(error.message);
    }

    this.storageService.addGroundPlaceActionHistory(stopGroupToMergeGpuid, {
      type: ActionType.MERGE_STOP_GROUP,
      into: intoStopGroupGpuid,
    });
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
          this.internalRemoveStopGroupFromStopCluster(
            stopGroupGpuid,
            stopClusterToMergeGpuid,
            CreateActionHistory.FALSE,
          );
          // If not, move it from the first StopCluster and remove it from it
        } else {
          this.internalMoveStopGroup(
            stopGroupGpuid,
            stopClusterToMergeGpuid,
            intoStopClusterGpuid,
            CreateActionHistory.FALSE,
          );
        }
      });
    } catch (error) {
      // If there is an error, previous update is reverted
      this.storageService.setGroundPlaces(cloneGroundPlaces);

      throw new Error(error.message);
    }

    this.storageService.addGroundPlaceActionHistory(stopClusterToMergeGpuid, {
      type: ActionType.MERGE_STOP_CLUSTER,
      into: intoStopClusterGpuid,
    });
  }

  /**
   * @description Delete StopGroup only if it does not contains SegmentProviderStop.
   * @param {StopGroupGpuid} stopGroupGpuid - Ground place unique identifier of the StopGroup to remove.
   * @returns {void}
   */
  public deleteStopGroup(stopGroupGpuid: StopGroupGpuid): void {
    this.storageService.deletePlace(stopGroupGpuid, GroundPlaceType.GROUP);

    this.storageService.addGroundPlaceActionHistory(stopGroupGpuid, {
      type: ActionType.DELETE_STOP_GROUP,
    });
  }

  /**
   * @description Delete StopCluster only if it does not contains StopGroup.
   * @param {StopClusterGpuid} stopClusterGpuid - Ground place unique identifier of the StopCluster to remove.
   * @returns {void}
   */
  public deleteStopCluster(stopClusterGpuid: StopClusterGpuid): void {
    this.storageService.deletePlace(stopClusterGpuid, GroundPlaceType.CLUSTER);

    this.storageService.addGroundPlaceActionHistory(stopClusterGpuid, {
      type: ActionType.DELETE_STOP_CLUSTER,
    });
  }

  /**
   * @description Getter to retrieve the GroundPlaces object.
   * @returns {GroundPlace[]}
   */
  public getGroundPlaces(): GroundPlace[] {
    return this.storageService.getGroundPlaces();
  }

  /**
   * @description Get the GroundPlaces file.
   * @returns {GroundPlacesFile}
   */
  public getGroundPlacesFile(): GroundPlacesFile {
    return this.storageService.getGroundPlacesFile();
  }

  /**
   * @description Getter to retrieve the GroundPlaceActionHistory object.
   * @returns {GroundPlaceActionHistory[]}
   */
  public getGroundPlacesActionHistory(): GroundPlaceActionHistory[] {
    return this.storageService.getGroundPlacesActionHistory();
  }

  /**
   * @description Apply the GroundPlacesActionHistory file to the GroundPlaces object.
   * @param {GroundPlaceActionHistory[]} groundPlacesActionHistory - File that store all changes to apply on the GroundPlacesFile.
   * @returns {void}
   */
  public applyGroundPlacesActionHistory(groundPlacesActionHistory: GroundPlaceActionHistory[]): void {
    const groundPlaces: GroundPlace[] = this.getGroundPlaces();
    const cloneGroundPlaces: GroundPlace[] = cloneDeep(this.getGroundPlaces());

    if (!groundPlaces.length) {
      throw new Error(
        `You can't apply your GroundPlacesActionHistory file because there is no GroundPlaces available on this instance. You should call the "init" method with your GroundPlacesFile before using this method.`,
      );
    }

    try {
      groundPlacesActionHistory.map((groundPlaceActionHistory: GroundPlaceActionHistory) => {
        const [groundPlaceGpuid, { type, into: intoGroundPlaceGpuid, from: fromGroundPlaceGpuid, params }]: [
          Gpuid,
          GroundPlaceActionOptions,
        ] = Object.entries(groundPlaceActionHistory)[0];

        switch (type) {
          case ActionType.CREATE_STOP_GROUP:
            return this.createStopGroup(params.segmentProviderStopId, groundPlaceGpuid, {
              countryCode: params.countryCode,
              latitude: params.latitude,
              longitude: params.longitude,
              name: params.name,
            });

          case ActionType.CREATE_STOP_CLUSTER:
            return this.createStopCluster(groundPlaceGpuid, {
              countryCode: params.countryCode,
              latitude: params.latitude,
              longitude: params.longitude,
              name: params.name,
            });

          case ActionType.UPDATE_STOP_GROUP: {
            const propertiesToUpdate: UpdateGroundPlaceProperties = {
              latitude: params.latitude,
              longitude: params.longitude,
              name: params.name,
            };

            sanitizeGroundPlacePropertiesToUpdate(propertiesToUpdate);

            return this.updateStopGroup(groundPlaceGpuid, propertiesToUpdate);
          }

          case ActionType.UPDATE_STOP_CLUSTER: {
            const propertiesToUpdate: UpdateGroundPlaceProperties = {
              latitude: params.latitude,
              longitude: params.longitude,
              name: params.name,
            };

            sanitizeGroundPlacePropertiesToUpdate(propertiesToUpdate);

            return this.updateStopCluster(groundPlaceGpuid, propertiesToUpdate);
          }

          case ActionType.ADD_STOP_GROUP_TO_STOP_CLUSTER:
            return this.addStopGroupToStopCluster(groundPlaceGpuid, intoGroundPlaceGpuid);

          case ActionType.REMOVE_STOP_GROUP_FROM_STOP_CLUSTER:
            return this.removeStopGroupFromStopCluster(groundPlaceGpuid, fromGroundPlaceGpuid);

          case ActionType.MOVE_STOP_GROUP:
            return this.moveStopGroup(groundPlaceGpuid, fromGroundPlaceGpuid, intoGroundPlaceGpuid);

          case ActionType.MOVE_SEGMENT_PROVIDER_STOP:
            return this.moveSegmentProviderStop(params.segmentProviderStopId, groundPlaceGpuid, intoGroundPlaceGpuid);

          case ActionType.MERGE_STOP_GROUP:
            return this.mergeStopGroup(groundPlaceGpuid, intoGroundPlaceGpuid);

          case ActionType.MERGE_STOP_CLUSTER:
            return this.mergeStopCluster(groundPlaceGpuid, intoGroundPlaceGpuid);

          case ActionType.DELETE_STOP_GROUP:
            return this.deleteStopGroup(groundPlaceGpuid);

          case ActionType.DELETE_STOP_CLUSTER:
            return this.deleteStopCluster(groundPlaceGpuid);

          default:
            return;
        }
      });
    } catch (error) {
      // If there is an error, previous update is reverted
      this.storageService.setGroundPlaces(cloneGroundPlaces);

      throw new Error(`There is an error inside your GroundPlacesActionHistory file. More details: "${error.message}"`);
    }
  }
}
