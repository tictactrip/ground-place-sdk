import {
  GroundPlacesObject,
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
  private readonly groundPlaces: GroundPlacesObject;

  constructor(groundPlacesFile: string) {
    this.groundPlaces = this.readJSONFile(groundPlacesFile);
  }

  /**
   * @description Parse the JSON File that have all the ground places.
   * @param {string} groundPlacesFile - The JSON File to parse.
   * @returns {GroundPlacesArray}
   */
  public readJSONFile(groundPlacesFile: string): GroundPlacesObject {
    return JSON.parse(groundPlacesFile);
  }

  /**
   * @description Getter to retrieve the Ground places.
   * @returns {GroundPlacesObject}
   */
  public getGroundPlaces(): GroundPlacesObject {
    return this.groundPlaces;
  }

  /**
   * @description Returns the stopGroup identified by its Gpuid.
   * @param {StopGroupGpuid} stopGroupGpuid - Ground Place unique identifier of the StopGroup to find.
   * @returns {StopGroup}
   */
  public getStopGroupByGpuid(stopGroupGpuid: StopGroupGpuid): StopGroup {
    const groundPlace = this.groundPlaces[stopGroupGpuid];

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
    const groundPlace = this.groundPlaces[stopClusterGpuid];

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
    this.groundPlaces[placeGpuid] = {
      ...this.groundPlaces[placeGpuid],
      ...propertiesToUpdate,
    };
  }
}
