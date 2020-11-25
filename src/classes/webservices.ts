import { GroundPlacesFile } from '../types';

/**
 * @description APIs to push or retrieve GroundPlaces.
 */
export class WebServices {
  /**
   * @description Download the file from AWS S3.
   * @returns {string}
   */
  // @ts-ignore
  public downloadDistantGroundPlacesMaster(): GroundPlacesFile {}

  /**
   * @description Upload the file to AWS S3.
   * @returns {Promise<void>}
   */
  public async upload(): Promise<void> {}

  /**
   * @description Download the file from AWS S3 and store it on the desktop.
   * @returns {void}
   */
  // @ts-ignore
  public downloadToDesktop(): void {}
}
