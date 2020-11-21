import {
  GroundPlaces,
  StopGroup,
  StopCluster,
  StopGroupGpuid,
  StopClusterGpuid,
  GroundPlaceType,
  Gpuid,
  UpdateStopProperties,
  AutoCompleteFilters,
  AutoComplete,
} from '../types';

/**
 * @description Manipulate GroundPlaces.
 */
export class Storage {
  private groundPlaces: GroundPlaces;

  // -----------------------------------------------------------------------------
  // ----------------------------- PUBLIC METHODS --------------------------------
  // -----------------------------------------------------------------------------

  /**
   * @description Init and read the GroundPlaces file.
   * @param {GroundPlaces} groundPlacesFile - The file to store and manipulate, can only be JSON for now.
   */
  public initFile(groundPlacesFile: GroundPlaces): void {
    this.groundPlaces = groundPlacesFile;
  }

  /**
   * @description Getter to retrieve the Ground places.
   * @returns {GroundPlaces}
   */
  public getGroundPlaces(): GroundPlaces {
    return this.groundPlaces;
  }

  /**
   * @description Setter to update the Ground places.
   * @param {GroundPlaces} groundPlaces - Ground places to store inside the Storage.
   * @returns {void}
   */
  public setGroundPlaces(groundPlaces: GroundPlaces): void {
    this.groundPlaces = groundPlaces;
  }

  /**
   * @description Clone current ground places stored.
   * @returns {GroundPlaces}
   */
  public cloneGroundPlaces(): GroundPlaces {
    return JSON.parse(JSON.stringify(this.groundPlaces));
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

  /**
   * @description Allows you to filter the ground places according to criteria such as name, gpuid, etc.
   * @param {AutoCompleteFilters[]} filters
   * @returns {AutoComplete[]}
   */
  public filterGroundPlaces(filters?: AutoCompleteFilters[]): AutoComplete[] {
    const groundPlacesAutocomplete = this.parseGroundPlaces();

    // Returns early the Ground places if there is no filters to use.
    if (!filters || !filters.length) return groundPlacesAutocomplete;
  }

  // -----------------------------------------------------------------------------
  // ----------------------------- PRIVATE METHODS -------------------------------
  // -----------------------------------------------------------------------------

  /**
   * @description Converts the Ground places to an array list manipulable.
   * @returns {void}
   */
  private parseGroundPlaces(): AutoComplete[] {
    return Object.entries(this.groundPlaces).map(
      ([gpuid, place]: [StopGroupGpuid | StopClusterGpuid, StopGroup | StopCluster]) => ({
        gpuid,
        ...place,
      }),
    );
  }
}
