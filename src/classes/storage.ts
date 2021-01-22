import * as cloneDeep from 'lodash.clonedeep';
import {
  GroundPlace,
  GroundPlacesFile,
  StopGroup,
  StopCluster,
  StopGroupGpuid,
  StopClusterGpuid,
  GroundPlaceType,
  Gpuid,
  UpdateGroundPlaceProperties,
  GroundPlaceFromFile,
  GroundPlaceActionHistory,
  GroundPlaceActionOptions,
} from '../types';

/**
 * @description Manipulate GroundPlaces.
 */
export class Storage {
  private groundPlaces: GroundPlace[] = [];
  private groundPlacesActionHistory: GroundPlaceActionHistory[] = [];

  /**
   * @description Init and parse the GroundPlaces file into an array manipulable.
   * @param {GroundPlacesFile} groundPlacesFile - The file to store and manipulate, can only be JSON for now.
   * @returns {void}
   */
  public initFile(groundPlacesFile: GroundPlacesFile): void {
    const groundPlaces: GroundPlace[] = Object.entries(groundPlacesFile).map(
      ([gpuid, place]: [Gpuid, GroundPlaceFromFile]): GroundPlace => ({
        gpuid,
        ...place,
      }),
    );

    this.groundPlaces = groundPlaces;
  }

  /**
   * @description This method is used by all the handling methods of the GroundPlacesController class to add a new action to the history of changes inside an GroundPlacesActionHistory object.
   * @param {Gpuid} groundPlaceGpuid - Ground place unique identifier of the StopGroup or the StopCluster that is concerns by the changes.
   * @param {GroundPlaceActionOptions} groundPlaceActionOptions - Options that are used by the GroundPlacesController handling method concerned.
   * @returns {void}
   */
  public addGroundPlaceActionHistory(
    groundPlaceGpuid: Gpuid,
    groundPlaceActionOptions: GroundPlaceActionOptions,
  ): void {
    const groundPlaceActionHistory: GroundPlaceActionHistory = {
      [groundPlaceGpuid]: {
        ...groundPlaceActionOptions,
      },
    };

    this.groundPlacesActionHistory.push(groundPlaceActionHistory);
  }

  /**
   * @description Getter to retrieve the Ground places.
   * @returns {GroundPlace[]}
   */
  public getGroundPlaces(): GroundPlace[] {
    return this.groundPlaces;
  }

  /**
   * @description Getter to retrieve the GroundPlaceActionHistory object.
   * @returns {GroundPlaceActionHistory[]}
   */
  public getGroundPlacesActionHistory(): GroundPlaceActionHistory[] {
    return this.groundPlacesActionHistory;
  }

  /**
   * @description Setter to update the Ground places.
   * @param {GroundPlace[]} groundPlaces - Ground places to store inside the Storage.
   * @returns {void}
   */
  public setGroundPlaces(groundPlaces: GroundPlace[]): void {
    this.groundPlaces = groundPlaces;
  }

  /**
   * @description Add a new place to the Ground places.
   * @param {GroundPlace} groundPlace - Could be a StopGroup or a StopCluster.
   * @returns {void}
   */
  public addPlace(groundPlace: GroundPlace): void {
    this.groundPlaces.push(groundPlace);
  }

  /**
   * @description Returns the stopGroup identified by its Gpuid.
   * @param {StopGroupGpuid} stopGroupGpuid - Ground Place unique identifier of the StopGroup to find.
   * @returns {StopGroup}
   */
  public getStopGroupByGpuid(stopGroupGpuid: StopGroupGpuid): StopGroup {
    const placeIndex: number = this.groundPlaces.findIndex(({ gpuid }: GroundPlace) => gpuid === stopGroupGpuid);

    const groundPlace: GroundPlace | undefined = this.groundPlaces[placeIndex];

    if (!groundPlace || groundPlace.type !== GroundPlaceType.GROUP) {
      throw new Error(`The StopGroup with the Gpuid "${stopGroupGpuid}" is not found.`);
    }

    return cloneDeep(groundPlace);
  }

  /**
   * @description Returns the stopCluster identified by its Gpuid.
   * @param {StopClusterGpuid} stopClusterGpuid - Ground place unique identifier of the StopCluster to find.
   * @returns {StopCluster}
   */
  public getStopClusterByGpuid(stopClusterGpuid: StopClusterGpuid): StopCluster {
    const placeIndex: number = this.groundPlaces.findIndex(({ gpuid }: GroundPlace) => gpuid === stopClusterGpuid);

    const groundPlace: GroundPlace | undefined = this.groundPlaces[placeIndex];

    if (!groundPlace || groundPlace.type !== GroundPlaceType.CLUSTER) {
      throw new Error(`The StopCluster with the Gpuid "${stopClusterGpuid}" is not found.`);
    }

    return cloneDeep(groundPlace);
  }

  /**
   * @description Find the correct place based on the Ground place unique identifier provided and the type of the place.
   * @param {Gpuid} placeGpuid - Ground place unique identifier of the place to search.
   * @param {GroundPlaceType} placeType - The type of the place to search, can be StopGroup or StopCluster.
   */
  public getPlaceByGpuid(placeGpuid: Gpuid, placeType: GroundPlaceType): GroundPlace {
    switch (placeType) {
      case GroundPlaceType.GROUP:
        return this.getStopGroupByGpuid(placeGpuid);

      case GroundPlaceType.CLUSTER:
        return this.getStopClusterByGpuid(placeGpuid);
    }
  }

  /**
   * @description Update StopGroup or StopCluster with new informations like name, latitude, longitude, etc.
   * @param {Gpuid} placeGpuid - Ground place unique identifier of the place to update.
   * @param {UpdateGroundPlaceProperties} propertiesToUpdate - Properties to update {name, lattitude, longitude}.
   * @param {GroundPlaceType} placeType - The type of the place to update, can be StopGroup or StopCluster.
   * @returns {void}
   */
  public updatePlace(
    placeGpuid: Gpuid,
    propertiesToUpdate: UpdateGroundPlaceProperties,
    placeType: GroundPlaceType,
  ): void {
    const groundPlace: GroundPlace = this.getPlaceByGpuid(placeGpuid, placeType);

    Object.keys(propertiesToUpdate).forEach((key: string) => {
      if (propertiesToUpdate[key] === undefined) {
        throw new Error(
          `You can't update the "${placeType}" with the Gpuid "${placeGpuid}" because the property named "${key}" is undefined.`,
        );
      }
    });

    const newGroundPlace: GroundPlace = {
      ...groundPlace,
      ...propertiesToUpdate,
    };

    this.replacePlace(newGroundPlace);
  }

  /**
   * @description Replace the specified ground place with a new one.
   * @param {GroundPlace} groundPlace - The place to replace.
   */
  public replacePlace(groundPlace: GroundPlace): void {
    const groundPlaceIndex: number = this.groundPlaces.findIndex(
      ({ gpuid }: GroundPlace) => gpuid === groundPlace.gpuid,
    );

    if (groundPlaceIndex === -1) {
      throw new Error(
        `The "${groundPlace.type}" with the Gpuid "${groundPlace.gpuid}" cannot be replace because it doesn't exists inside the Ground places list.`,
      );
    }

    this.groundPlaces[groundPlaceIndex] = groundPlace;
  }

  /**
   * @description Delete place only if it's empty.
   * @param {Gpuid} placeToRemoveGpuid - Ground place unique identifier of the place to remove.
   * @param {GroundPlaceType} placeType - The type of the place to remove, can be StopGroup or StopCluster.
   * @returns {void}
   */
  public deletePlace(placeToRemoveGpuid: Gpuid, placeType: GroundPlaceType): void {
    const groundPlace: GroundPlace = this.getPlaceByGpuid(placeToRemoveGpuid, placeType);

    if (groundPlace.childs.length) {
      throw new Error(
        `The "${placeType}" with the Gpuid "${placeToRemoveGpuid}" cannot be deleted because it has children.`,
      );
    }

    const placeIndex: number = this.groundPlaces.findIndex(({ gpuid }: GroundPlace) => gpuid === placeToRemoveGpuid);

    // Delete the place from the GroundPlaces list.
    this.groundPlaces.splice(placeIndex, 1);

    // If the place is a StopGroup, all references to this StopGroup are also removed from its possible StopCluster parent.
    if (placeType === GroundPlaceType.GROUP) {
      this.groundPlaces.map(
        (groundPlace: GroundPlace): GroundPlace => {
          if (groundPlace.type === GroundPlaceType.CLUSTER && groundPlace.childs.includes(placeToRemoveGpuid)) {
            const referenceIndex: number = groundPlace.childs.findIndex(
              (stopGroupGpuid: StopGroupGpuid) => stopGroupGpuid === placeToRemoveGpuid,
            );

            groundPlace.childs.splice(referenceIndex, 1);
          }

          return groundPlace;
        },
      );
    }
  }
}
