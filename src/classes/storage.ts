import {
  GroundPlacesStored,
  StopGroup,
  StopCluster,
  StopGroupGpuid,
  StopClusterGpuid,
  GroundPlaceType,
  Gpuid,
  StopGroupProperties,
  StopClusterProperties,
} from '../types';

/**
 * @description Manipulate GroundPlaces.
 */
export class Storage {
  private groundPlaces: GroundPlacesStored;

  /**
   * @description Init and read the GroundPlaces file.
   * @param {string} groundPlacesFile - The file to store and manipulate, can only be JSON for now.
   */
  public initFile(groundPlacesFile: string): void {
    this.groundPlaces = this.readJSONFile(groundPlacesFile);
  }

  /**
   * @description Parse the JSON File that have all the ground places.
   * @param {string} groundPlacesFile - The JSON File to parse.
   * @returns {GroundPlacesStored}
   */
  public readJSONFile(groundPlacesFile: string): GroundPlacesStored {
    return JSON.parse(groundPlacesFile);
  }

  /**
   * @description Getter to retrieve the Ground places.
   * @returns {GroundPlacesStored}
   */
  public getGroundPlaces(): GroundPlacesStored {
    return this.groundPlaces;
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

    return groundPlace as StopGroup;
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

    return groundPlace as StopCluster;
  }

  /**
   * @description Update StopGroup or StopCluster with new informations like name, latitude, longitude, etc.
   * @param {Gpuid} placeGpuid - Ground place unique identifier of the place to update.
   * @param {StopGroupProperties|StopClusterProperties} propertiesToUpdate - Properties to update.
   * @returns {void}
   */
  public updatePlace(placeGpuid: Gpuid, propertiesToUpdate: StopGroupProperties | StopClusterProperties): void {
    const newGroundPlace: StopGroup | StopCluster = {
      ...this.groundPlaces[placeGpuid],
      ...propertiesToUpdate,
    };

    this.groundPlaces[placeGpuid] = newGroundPlace;
  }
}
