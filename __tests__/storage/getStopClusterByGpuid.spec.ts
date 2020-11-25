import { Storage } from '../../src/classes/storage';
import * as mockSmallGroundPlacesFile from '../../mocks/smallGroundPlacesFile.json';
import { GroundPlacesFile } from '../../src/types';

describe('#getStopClusterByGpuid', () => {
  const storageService: Storage = new Storage();
  storageService.initFile(mockSmallGroundPlacesFile as GroundPlacesFile);

  it('should return the right StopCluster based on its Gpuid', () => {
    expect(storageService.getStopClusterByGpuid('c|FRstrasbou@u0ts2')).toStrictEqual({
      gpuid: 'c|FRstrasbou@u0ts2',
      unique_name: 'strasbourg',
      childs: ['g|FRststbi__@u0tkxd'],
      serviced: 'True',
      has_been_modified: false,
      warning: false,
      country_code: 'fr',
      is_latest: true,
      name: 'Strasbourg, Grand-Est, France',
      longitude: 7.74815,
      latitude: 48.583,
      type: 'cluster',
    });
  });

  it('should throw an error if the StopCluster based on its Gpuid is not found', () => {
    let thrownError: Error;

    try {
      storageService.getStopClusterByGpuid('g|FRststbi__@');
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(new Error('The StopCluster with the Gpuid g|FRststbi__@ is not found.'));
  });

  it('should throw an error if the StopCluster based on its Gpuid is found but not of type cluster', () => {
    let thrownError: Error;

    try {
      storageService.getStopClusterByGpuid('g|FRstraroet@u0tkr3');
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(new Error('The StopCluster with the Gpuid g|FRstraroet@u0tkr3 is not found.'));
  });
});
