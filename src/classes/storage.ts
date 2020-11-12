import {
  GroundPlacesObject,
  StopGroup,
  StopCluster,
  StopGroupGpuid,
  StopClusterGpuid,
  GroundPlaceType,
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
   * @param jsonFile The JSON File to parse.
   * @returns {GroundPlacesArray}
   */
  public readJSONFile(groundPlacesFile: string): GroundPlacesObject {
    const parsedJSON: GroundPlacesObject = JSON.parse(groundPlacesFile);

    return parsedJSON;
  }

  /**
   * @description Returns the stopGroup identified by its Gpuid.
   * @param {StopGroupGpuid} stopGroupGpuid - Ground Place unique identifier of the StopGroup to find.
   * @returns {StopGroup}
   */
  // @ts-ignore
  public getStopGroup(stopGroupGpuid: StopGroupGpuid): StopGroup {
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
  // @ts-ignore
  public getStopCluster(stopClusterGpuid: StopClusterGpuid): StopCluster {
    const groundPlace = this.groundPlaces[stopClusterGpuid];

    if (!groundPlace || groundPlace.type !== GroundPlaceType.CLUSTER) {
      throw new Error(`The StopCluster with the Gpuid ${stopClusterGpuid} is not found.`);
    }

    return groundPlace as StopCluster;
  }

  /**
   * @description Getter to retrieve the Ground places.
   * @returns {GroundPlacesObject}
   */
  public getGroundPlaces(): GroundPlacesObject {
    return this.groundPlaces;
  }

  /**
   * @description Delete StopGroup only if empty.
   * @param {StopGroupGpuid} stopGroupGpuid - Ground place unique identifier of the StopGroup to remove.
   * @returns {void}
   */
  public deleteStopGroup(): void {}

  /**
   * @description Delete StopCluster only if empty.
   * @param {StopClusterGpuid} stopClusterGpuid - Ground place unique identifier of the StopCluster to remove.
   * @returns {void}
   */
  public deleteStopCluster(): void {}
}
