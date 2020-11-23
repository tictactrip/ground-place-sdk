import {
  GroundPlaces,
  StopGroup,
  StopCluster,
  StopGroupGpuid,
  StopClusterGpuid,
  GroundPlaceType,
  GroundPlaceServiced,
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
   * @returns {void}
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
   * @param {AutoCompleteFilters[]|undefined} filters - The filters you want to be applied on the search.
   * @returns {AutoComplete[]}
   */
  public filterGroundPlaces(filters?: AutoCompleteFilters[]): AutoComplete[] {
    const groundPlacesAutocomplete: AutoComplete[] = this.parseGroundPlaces();

    // Returns earlier the Ground places if there is no filters to use.
    if (!filters || !filters.length) return groundPlacesAutocomplete;

    const filteredByGroup: AutoComplete[] = this.filterGroundPlacesByGroup(
      groundPlacesAutocomplete,
      filters.includes(AutoCompleteFilters.STOP_GROUP),
    );

    const filteredByCluster: AutoComplete[] = this.filterGroundPlacesByCluster(
      groundPlacesAutocomplete,
      filters.includes(AutoCompleteFilters.STOP_CLUSTER),
    );

    const filteredByType: AutoComplete[] = [...filteredByGroup, ...filteredByCluster];

    const filteredBySegmentProviderStop: AutoComplete[] = this.filterGroundPlacesBySegmentProvider(
      // Filtering by segment provider must be made on the whole results previously filtered.
      // We checks here if this filter must be applied on results already filtered or not.
      filteredByType.length ? filteredByType : groundPlacesAutocomplete,
      filters.includes(AutoCompleteFilters.SEGMENT_PROVIDER_STOP),
    );

    const filteredByService: AutoComplete[] = this.filterGroundPlacesByServiced(
      filteredBySegmentProviderStop,
      filters.includes(AutoCompleteFilters.SERVICED),
    );

    return filteredByService;
  }

  /**
   * @description Search through ground places with specific words.
   * @param {AutoComplete[]} groundPlaces - The places on which the search is used.
   * @param {string} search - The search to find the requested places.
   * @returns {AutoComplete[]}
   */
  public searchGroundPlaces(groundPlaces: AutoComplete[], search: string): AutoComplete[] {
    return groundPlaces.filter((place) => {
      // Method toLowerCase() is used because the includes() method is case sensitive
      const currentSearch = search.toLowerCase();

      /* Search by unique name. This search only concern StopCluster. */
      if (place.type === GroundPlaceType.CLUSTER && place.unique_name.toLowerCase().includes(currentSearch)) {
        return place;
      }

      /* Search by Gpuid and by name */
      if (place.gpuid.toLowerCase().includes(currentSearch) || place.name.toLowerCase().includes(currentSearch)) {
        return place;
      }
    });
  }

  // -----------------------------------------------------------------------------
  // ----------------------------- PRIVATE METHODS -------------------------------
  // -----------------------------------------------------------------------------

  /**
   * @description Converts the Ground places to an array list manipulable.
   * @returns {AutoComplete[]}
   */
  private parseGroundPlaces(): AutoComplete[] {
    return Object.entries(this.groundPlaces).map(
      ([gpuid, place]: [StopGroupGpuid | StopClusterGpuid, StopGroup | StopCluster]) => ({
        gpuid,
        ...place,
      }),
    );
  }

  /**
   * @description Filter Ground places by group type.
   * @param {AutoComplete[]} groundPlaces - Ground places list to be filtered.
   * @param {boolean} filterByGroup - Filter or not by group type.
   * @returns {AutoComplete[]}
   */
  private filterGroundPlacesByGroup(groundPlaces: AutoComplete[], filterByGroup: boolean): AutoComplete[] {
    if (filterByGroup) {
      return groundPlaces.filter((place: AutoComplete) => place.type === GroundPlaceType.GROUP);
    }

    return [];
  }

  /**
   * @description Filter Ground places by cluster type.
   * @param {AutoComplete[]} groundPlaces - Ground places list to be filtered.
   * @param {boolean} filterByCluster - Filter or not by cluster type.
   * @returns {AutoComplete[]}
   */
  private filterGroundPlacesByCluster(groundPlaces: AutoComplete[], filterByCluster: boolean): AutoComplete[] {
    if (filterByCluster) {
      return groundPlaces.filter((place: AutoComplete) => place.type === GroundPlaceType.CLUSTER);
    }

    return [];
  }

  /**
   * @description Filter Ground places by Segment Provider in it.
   * @param {AutoComplete[]} groundPlaces - Ground places list to be filtered.
   * @param {boolean} filterBySegmentProvider - Filter or not by segment provider in it.
   * @returns {AutoComplete[]}
   */
  private filterGroundPlacesBySegmentProvider(
    groundPlaces: AutoComplete[],
    filterBySegmentProvider: boolean,
  ): AutoComplete[] {
    if (filterBySegmentProvider) {
      // Since StopGroups and StopClusters do not share the same structures
      // We have to search the StopGroups from the StopCluster in order to find the potential segmentProviderStop.
      return groundPlaces.filter((place: AutoComplete) => {
        /* Check inside StopCluster through its StopGroup(s) children(s) */
        if (place.type === GroundPlaceType.CLUSTER) {
          const isSegmentProviderExist = place.childs.find(
            (stopGroupGpuid) => this.getStopGroupByGpuid(stopGroupGpuid).childs.length,
          );

          if (isSegmentProviderExist) return place;
          /* Check inside StopGroup through its children(s) */
        } else if (place.type === GroundPlaceType.GROUP && place.childs.length) {
          return place;
        }
      });
    }

    return groundPlaces;
  }

  /**
   * @description Filter Ground places by serviced.
   * @param {AutoComplete[]} groundPlaces - Ground places list to be filtered.
   * @param {boolean} filterByServiced - Filter or not by serviced.
   * @returns {AutoComplete[]}
   */
  private filterGroundPlacesByServiced(groundPlaces: AutoComplete[], filterByServiced: boolean): AutoComplete[] {
    if (filterByServiced) {
      return groundPlaces.filter((place: AutoComplete) => place.serviced === GroundPlaceServiced.TRUE);
    }

    return groundPlaces;
  }
}
