import {
  GroundPlacesFile,
  StopGroup,
  StopCluster,
  GroundPlacesArray,
  StopGroupGpuid,
  StopClusterGpuid,
  Gpuid,
  GroundPlaceType,
} from '../types';

/**
 * @description Manipulate GroundPlaces.
 */
export class Storage {
  public readonly groundPlacesArray: GroundPlacesArray;

  constructor(groundPlacesFile: GroundPlacesFile) {
    this.groundPlacesArray = this.readJSONFile(groundPlacesFile);
  }

  /**
   * @description Parse the JSON File that have all the ground places.
   * @param jsonFile The JSON File to parse.
   * @returns {GroundPlacesArray}
   */
  public readJSONFile(groundPlacesFile: GroundPlacesFile): GroundPlacesArray {
    const stringifyJSON: string = JSON.stringify(groundPlacesFile);
    const parsedJSON: GroundPlacesFile = JSON.parse(stringifyJSON);

    return Object.entries(parsedJSON).map(([gpuid, place]: [Gpuid, StopGroup | StopCluster]) => ({
      gpuid,
      place,
    }));
  }

  /**
   * @description Returns the stopGroup identified by its Gpuid.
   * @param {StopGroupGpuid} stopGroupGpuid - Ground Place unique identifier of the StopGroup to find.
   * @returns {StopGroup|Error}
   */
  // @ts-ignore
  public getStopGroup(stopGroupGpuid: StopGroupGpuid): StopGroup | Error {
    const groundPlace = this.groundPlacesArray.find(
      ({ place, gpuid }) => gpuid === stopGroupGpuid && place.type === GroundPlaceType.Group,
    );

    if (groundPlace === undefined) {
      throw new Error(`The StopGroup with the Gpuid ${stopGroupGpuid} is not found.`);
    }

    return groundPlace.place as StopGroup;
  }

  /**
   * @description Returns the stopCluster identified by its Gpuid.
   * @param {StopClusterGpuid} stopClusterGpuid - Ground place unique identifier of the StopCluster to find.
   * @returns {StopCluster|Error}
   */
  // @ts-ignore
  public getStopCluster(stopClusterGpuid: StopClusterGpuid): StopCluster | Error {
    const groundPlace = this.groundPlacesArray.find(
      ({ place, gpuid }) => gpuid === stopClusterGpuid && place.type === GroundPlaceType.Cluster,
    );

    if (groundPlace === undefined) {
      throw new Error(`The StopCluster with the Gpuid ${stopClusterGpuid} is not found.`);
    }

    return groundPlace.place as StopCluster;
  }

  /**
   * @description Getter to retrieve the Ground places.
   * @returns {GroundPlacesArray}
   */
  public getGroundPlaces(): GroundPlacesArray {
    return this.groundPlacesArray;
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
