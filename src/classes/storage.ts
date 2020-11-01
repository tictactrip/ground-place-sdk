
import { StopGroup, StopCluster } from '../types';

interface Properties {}

/**
 * @description Manipulate GroundPlaces.
 */
export class Storage {

  /**
   * @description Returns the stopGroup identified by its Gpuid.
   * @param Gpuid Ground Place unique identifier.
   */
  // @ts-ignore
  public getStopGroupByGpuid(Gpuid: string): StopGroup | undefined {} 

  /**
   * @description Returns the stopCluster identified by its Gpuid.
   * @param Gpuid Ground place unique identifier.
   */
  // @ts-ignore
  public getStopClusterByGpuid(Gpuid: string): StopCluster | undefined {} 

  /**
   * @description Create the stopGroup with the values given.
   * @param Gpuid Ground place unique identifier of the stopCluster parent.
   * @param stopGroupInfos StopGroup informations.
   */
  // @ts-ignore
  public createStopGroup(Gpuid: string, stopGroupInfos: StopGroup): StopGroup {}

  /**
   * @description Create the stopCluster with the values given.
   * @param Gpuid Ground place unique identifier of the stopCluster parent.
   * @param stopClusterInfos stopCluster informations.
   */
  // @ts-ignore
  public createStopCluster(Gpuid: string, stopClusterInfos: StopCluster): StopCluster {}

  /**
   * @description Update the stopGroup with the new values given.
   * @param Gpuid Ground place unique identifier.
   * @param propertiesToUpdate Properties that need to be update. 
   */
  // @ts-ignore
  public updateStopGroup(Gpuid: string, propertiesToUpdate: Properties): StopGroup {}

  /**
   * @description Update the stopCluster with the new values given.
   * @param Gpuid Ground place unique identifier.
   * @param propertiesToUpdate Properties that need to be update. 
   */
  // @ts-ignore
  public updateStopCluster(Gpuid: string, propertiesToUpdate: Properties): StopCluster {}
}