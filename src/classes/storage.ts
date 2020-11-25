import {
  GroundPlace,
  GroundPlacesFile,
  StopGroup,
  StopCluster,
  StopGroupGpuid,
  StopClusterGpuid,
  GroundPlaceType,
  Gpuid,
  UpdateStopProperties,
} from '../types';

/**
 * @description Manipulate GroundPlaces.
 */
export class Storage {
  private groundPlaces: GroundPlace[];

  /**
   * @description Init and parse the GroundPlaces file into an array manipulable.
   * @param {GroundPlaces} groundPlacesFile - The file to store and manipulate, can only be JSON for now.
   * @returns {void}
   */
  public initFile(groundPlacesFile: GroundPlacesFile): void {
    const groundPlaces: GroundPlace[] = Object.entries(groundPlacesFile).map(
      ([gpuid, place]: [StopGroupGpuid | StopClusterGpuid, StopGroup | StopCluster]) => ({
        gpuid,
        ...place,
      }),
    );

    this.groundPlaces = groundPlaces;
  }

  /**
   * @description Getter to retrieve the Ground places.
   * @returns {GroundPlaces}
   */
  public getGroundPlaces(): GroundPlace[] {
    return this.groundPlaces;
  }

  /**
   * @description Setter to update the Ground places.
   * @param {GroundPlaces} groundPlaces - Ground places to store inside the Storage.
   * @returns {void}
   */
  public setGroundPlaces(groundPlaces: GroundPlace[]): void {
    this.groundPlaces = groundPlaces;
  }

  /**
   * @description Returns the stopGroup identified by its Gpuid.
   * @param {StopGroupGpuid} stopGroupGpuid - Ground Place unique identifier of the StopGroup to find.
   * @returns {StopGroup}
   */
  public getStopGroupByGpuid(stopGroupGpuid: StopGroupGpuid): StopGroup {
    const groundPlace: StopCluster | StopGroup = this.groundPlaces[stopGroupGpuid];

    if (!groundPlace || groundPlace.type !== GroundPlaceType.GROUP) {
      throw new Error(`The StopGroup with the Gpuid ${stopGroupGpuid} is not found.`);
    }

    return groundPlace;
  }

  /**
   * @description Returns the stopCluster identified by its Gpuid.
   * @param {StopClusterGpuid} stopClusterGpuid - Ground place unique identifier of the StopCluster to find.
   * @returns {StopCluster}
   */
  public getStopClusterByGpuid(stopClusterGpuid: StopClusterGpuid): StopCluster {
    const groundPlace: StopCluster | StopGroup = this.groundPlaces[stopClusterGpuid];

    if (!groundPlace || groundPlace.type !== GroundPlaceType.CLUSTER) {
      throw new Error(`The StopCluster with the Gpuid ${stopClusterGpuid} is not found.`);
    }

    return groundPlace;
  }

  /**
   * @description Update StopGroup or StopCluster with new informations like name, latitude, longitude, etc.
   * @param {Gpuid} placeGpuid - Ground place unique identifier of the place to update.
   * @param {UpdateStopProperties} propertiesToUpdate - Properties to update.
   * @returns {void}
   */
  public updatePlace(placeGpuid: Gpuid, propertiesToUpdate: UpdateStopProperties): void {
    const newGroundPlace: StopGroup | StopCluster = {
      ...this.groundPlaces[placeGpuid],
      ...propertiesToUpdate,
    };

    this.groundPlaces[placeGpuid] = newGroundPlace;
  }
}
