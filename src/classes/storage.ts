import { StopGroup, StopCluster, GroundPlacesList, StopGroupGpuid, StopClusterGpuid } from '../types';

/**
 * @description Manipulate GroundPlaces.
 */
export class Storage {
  private groundPlacesList: GroundPlacesList = null;

  constructor(groundPlaces: GroundPlacesList) {
    this.groundPlacesList = groundPlaces;
  }
  /**
   * @description Returns the stopGroup identified by its Gpuid.
   * @param {StopGroupGpuid} stopGroupGpuid - Ground Place unique identifier of the StopGroup to find.
   * @returns {StopGroup|Error}
   */
  // @ts-ignore
  public getStopGroup(stopGroupGpuid: StopGroupGpuid): StopGroup | Error {
    if (this.groundPlacesList[stopGroupGpuid]) {
      return this.groundPlacesList[stopGroupGpuid] as StopGroup;
    } else {
      throw new Error(`The StopGroup with the Gpuid ${stopGroupGpuid} is not found.`);
    }
  }

  /**
   * @description Returns the stopCluster identified by its Gpuid.
   * @param {StopClusterGpuid} stopClusterGpuid - Ground place unique identifier of the StopCluster to find.
   * @returns {StopCluster|Error}
   */
  // @ts-ignore
  public getStopCluster(stopClusterGpuid: StopClusterGpuid): StopCluster | Error {
    if (this.groundPlacesList[stopClusterGpuid]) {
      return this.groundPlacesList[stopClusterGpuid] as StopCluster;
    } else {
      throw new Error(`The StopCluster with the Gpuid ${stopClusterGpuid} is not found.`);
    }
  }

  /**
   * @description Getter to retrieve the Ground places list.
   */
  public getGroundPlacesList(): GroundPlacesList {
    return this.groundPlacesList;
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
