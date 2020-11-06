import {
  StopGroup,
  StopCluster,
  GroundPlacesList,
  GroundPlaceGenerated,
  StopGroupGpuid,
  StopClusterGpuid,
} from '../types';

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
   * @returns {StopGroup|undefined}
   */
  // @ts-ignore
  public getStopGroupByGpuid(stopGroupGpuid: StopGroupGpuid): StopGroup | Error {
    if (this.groundPlacesList[stopGroupGpuid]) {
      return this.groundPlacesList[stopGroupGpuid] as StopGroup;
    } else {
      throw new Error(`The StopGroup with the Gpuid ${stopGroupGpuid} is not found.`);
    }
  }

  /**
   * @description Returns the stopCluster identified by its Gpuid.
   * @param {StopClusterGpuid} stopClusterGpuid - Ground place unique identifier of the StopCluster to find.
   * @returns {StopCluster|undefined}
   */
  // @ts-ignore
  public getStopClusterByGpuid(stopClusterGpuid: StopClusterGpuid): StopCluster | Error {
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

  /**
   * @description Adding StopCluster to the ground places list.
   * @param {GroundPlaceGenerated} stopCluster - The stop cluster to add to the ground places list.
   * @returns {void}
   */
  public addStopClusterToGroundPlacesList({
    id: stopClusterGpuid,
    name,
    latitude,
    longitude,
    countryCode,
    type,
  }: GroundPlaceGenerated): void {
    // Create the StopCluster
    const newStopCluster = {
      [stopClusterGpuid]: { name, latitude, longitude, country_code: countryCode, type, childs: [] },
    };

    // TODO: Call checkValidity on the groundPlacesList to check if all rules are respected before adding the StopCluster

    // Append the StopCluster to the ground places list.
    this.groundPlacesList = {
      ...this.groundPlacesList,
      ...newStopCluster,
    };
  }

  /**
   * @description Adding StopGroup to the ground places list and also referenced it inside it's StopCluster parent.
   * @param {StopClusterGpuid} stopClusterParentGpuid - The StopCluster parent ground place unique identifier.
   * @param {GroundPlaceGenerated} stopGroup - The StopGroup to add to the ground places list.
   */
  public addStopGroupToGroundPlacesList(
    stopClusterParentGpuid: StopClusterGpuid,
    { id: stopGroupGpuid, name, latitude, longitude, countryCode, type }: GroundPlaceGenerated,
  ): void {
    // Create the StopGroup
    const newStopGroup = {
      [stopGroupGpuid]: {
        country_code: countryCode,
        name,
        longitude,
        latitude,
        type,
        childs: [],
      },
    };

    // TODO: Call checkValidity on the groundPlacesList to check if all rules are respected before adding the StopCluster

    // Add the StopGroup Gpuid inside it's StopCluster parent
    const stopClusterParent = {
      [stopClusterParentGpuid]: {
        ...this.groundPlacesList[stopClusterParentGpuid],
        childs: [...this.groundPlacesList[stopClusterParentGpuid].childs, stopGroupGpuid],
      } as StopCluster, // Type casting here otherwise TS will complain since groundPlacesList could have two structure of places..
    };

    // Append to the ground places list.
    this.groundPlacesList = {
      ...this.groundPlacesList,
      ...stopClusterParent,
      ...newStopGroup,
    };
  }
}
