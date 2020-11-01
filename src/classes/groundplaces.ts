
import { GroundPlace, StopGroup, StopCluster } from '../types';

interface Filters {}

/**
 * @description GroundPlaces business logic.
 */
export class GroundPlaces {

  /**
   * @description Returns a list of places.
   * @param query Can be a name, a Gpuid, a unique name or other name.
   * @param filters Filters with different options (StopGroup, StopCluster, Serviced, SegmentProvider).
   */
  // @ts-ignore
  public autocomplete(query: string, filters: Filters): (StopGroup | StopCluster)[] {}

  /**
   * @description Create stopCluster or stopGroup.
   * @param type Type can be stopCluster or stopGroup.
   * @param groundPlace Informations to use on creating the place.
   * @param GpuidParent Ground place unique identifier of the stopCluster parent if the type is a stopGroup. 
   */
  // @ts-ignore
  // This method will call Storage.createStopGroup or Storage.createStopCluster depending on type passed in params.
  public create(type: 'stopCluster' | 'stopGroup', groundPlace: GroundPlace, GpuidParent?: string): StopGroup | StopCluster {}

  /**
   * @description Create stopCluster or stopGroup.
   * @param type Type can be stopCluster or stopGroup.
   * @param groundPlace Informations to use on creating the place.
   */
  // @ts-ignore
  public update(type: 'stopCluster' | 'stopGroup', groundPlace: GroundPlace): StopGroup | StopCluster {}

  /**
   * @description Remove a stopGroup from a stopCluster.
   * @param stopClusterGpuid StopCluster Ground place unique identifier.
   * @param stopGroupGpuid StopGroup Ground place unique identifier to remove.
   */
  public removeStopGroupFromStopCluster(stopClusterGpuid: string, stopGroupGpuid: string): void {}
}