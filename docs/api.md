# API

## Table of Contents

- [init](#init)
- [getStopGroupByGpuid](#getStopGroupByGpuid)
- [getStopClusterByGpuid](#getStopClusterByGpuid)
- [getGroundPlaceByGpuid](#getGroundPlaceByGpuid)
- [autocomplete](#autocomplete)
- [createStopGroup](#createStopGroup)
- [createStopCluster](#createStopCluster)
- [updateStopGroup](#updateStopGroup)
- [updateStopCluster](#updateStopCluster)
- [addStopGroupToStopCluster](#addStopGroupToStopCluster)
- [removeStopGroupFromStopCluster](#removeStopGroupFromStopCluster)
- [moveStopGroup](#moveStopGroup)
- [moveSegmentProviderStop](#moveSegmentProviderStop)
- [mergeStopGroup](#mergeStopGroup)
- [mergeStopCluster](#mergeStopCluster)
- [deleteStopGroup](#deleteStopGroup)
- [deleteStopCluster](#deleteStopCluster)
- [getGroundPlaces](#getGroundPlaces)
- [getGroundPlacesFile](#getGroundPlacesFile)

<a name="init"></a>

## init

**syntax**: `groundPlacesService.init(groundPlacesFile)`

**arguments**:

- _groundPlacesFile_ (**GroundPlacesFile**): File that store all your `StopGroup`, `StopCluster` and `SegmentProviderStop`.

**returns**: `void`

Initialize the Ground Places SDK with a file of ground places.

This file must be in **JSON** format and can contain an unlimited number of ground places, it must respect the scheme defined [here](https://github.com/tictactrip/ground-place-sdk/blob/master/docs/ground_places_file_scheme.md).

**example:**

```ts
import { GroundPlacesController, GroundPlacesFile } from '@tictactrip/ground-place-sdk';
import GroundPlacesFileJSON from './ground_places_file.json';

const groundPlacesService: GroundPlacesController = new GroundPlacesController();

groundPlacesService.init(GroundPlacesFileJSON as GroundPlacesFile);
```

<a name="getStopGroupByGpuid"></a>

## getStopGroupByGpuid

**syntax**: `groundPlacesService.getStopGroupByGpuid(stopGroupGpuid)`

**arguments**:

- _stopGroupGpuid_ (`StopGroupGpuid`): Ground Place unique identifier of the StopGroup to find.

**returns**: `StopGroup`

Returns the StopGroup identified by its Gpuid.

**example**:

```ts
const stopGroup: StopGroup = groundPlacesService.getStopGroupByGpuid('g|FRststbi__@u0tkxd');
```

<a name="getStopClusterByGpuid"></a>

## getStopClusterByGpuid

**syntax**: `groundPlacesService.getStopClusterByGpuid(stopClusterGpuid)`

**arguments**:

- _stopClusterGpuid_ (`StopClusterGpuid`): Ground Place unique identifier of the StopCluster to find.

**returns**: `StopCluster`

Returns the StopCluster identified by its Gpuid.

**example**:

```ts
const stopCluster: StopCluster = groundPlacesService.getStopClusterByGpuid('c|FRstrasbou@u0ts2');
```

<a name="getGroundPlaceByGpuid"></a>

## getGroundPlaceByGpuid

**syntax**: `groundPlacesService.getGroundPlaceByGpuid(groundPlaceGpuid, placeType)`

**arguments**:

- _groundPlaceGpuid_ (`Gpuid`): Ground place unique identifier of the place to find.
- _placeType_ (`GroundPlaceType`): The type of the place to find, can be StopGroup or StopCluster.

**returns**: `GroundPlace`

Returns the correct place based on the Ground place unique identifier provided and the type of the place.

**example**:

```ts
// params retrieved from an external source of data
const { groundPlaceGpuid, placeType } = params;

const groundPlace: GroundPlace = groundPlacesService.getGroundPlaceByGpuid(groundPlaceGpuid, placeType);
```

<a name="autocomplete"></a>

## autocomplete

**syntax**: `groundPlacesService.autocomplete(query, filters)`

**arguments**:

- _query_ (`string`): Can be a name, a Gpuid, a unique name or other name.
- _filters_ (optional) (`AutocompleteFilter`): Filters with different options (StopGroup, StopCluster, Serviced, SegmentProvider).

**returns**: `GroundPlace[]`

Returns a list of ground places.

**example**:

```ts
// Returns only StopClusters that matching strasbourg
const groundPlacesFiltered: GroundPlace[] = groundPlacesService.autocomplete('strasbourg', [
  AutocompleteFilter.STOP_CLUSTER,
]);
```

<a name="createStopGroup"></a>

## createStopGroup

**syntax**: `groundPlacesService.createStopGroup(segmentProviderStopId, fromStopGroupGpuid, createGroundPlaceParams)`

**arguments**:

- _segmentProviderStopId_ (`string`): The identifier of the SegmentProviderStop used to create the new StopGroup.
- _fromStopGroupGpuid_ (`StopGroupGpuid`): Ground place unique identifier of the current StopGroup parent.
- _createGroundPlaceParams_ (`CreateGroundPlacesParams`): Parameters that are needed to create a new StopGroup.

**returns**: `StopGroupGpuid`

Create a new StopGroup from a SegmentProviderStop. It also return the `Gpuid` generated for the new `StopGroup`.

**example**:

```ts
const createStopGroupProperties = {
  countryCode: CountryCode.FR,
  name: 'Strasbourg - Wolfisheim',
  latitude: 50,
  longitude: 100,
};
const fromStopGroupGpuid = 'g|FRststbi__@u0tkxd';
const segmentProviderStopId = '19528';

const newStopGroupGpuid: StopGroupGpuid = groundPlacesService.createStopGroup(
  segmentProviderStopId,
  fromStopGroupGpuid,
  createStopGroupProperties,
);
```

<a name="createStopCluster"></a>

## createStopCluster

**syntax**: `groundPlacesService.createStopCluster(fromStopGroupGpuid, createGroundPlaceParams)`

**arguments**:

- _fromStopGroupGpuid_ (`StopGroupGpuid`): Ground place unique identifier of the StopGroup on which the StopCluster will be created.
- _createGroundPlaceParams_ (`CreateGroundPlacesParams`): Parameters that are needed to create a new StopCluster.

**returns**: `StopGroupGpuid`

Create a new StopCluster from a StopGroup. It also return the `Gpuid` generated for the new `StopCluster`.

**example**:

```ts
const createStopClusterProperties = {
  countryCode: CountryCode.FR,
  name: 'Strasbourg - Wolfisheim',
  latitude: 48.5857122,
  longitude: 7.6275127,
};
const fromStopGroupGpuid = 'g|FRststbi__@u0tkxd';

const newStopClusterGpuid: StopClusterGpuid = groundPlacesService.createStopCluster(
  fromStopGroupGpuid,
  createStopClusterProperties,
);
```

<a name="updateStopGroup"></a>

## updateStopGroup

**syntax**: `groundPlacesService.updateStopGroup(stopGroupGpuid, propertiesToUpdate)`

**arguments**:

- _stopGroupGpuid_ (`StopGroupGpuid`): Ground place unique identifier of the StopGroup to update.
- _propertiesToUpdate_ (`UpdateGroundPlaceProperties`): Properties that need to be update.

**returns**: `void`

Update StopGroup specified properties with new values given.

**example**:

```ts
groundPlacesService.updateStopGroup('g|FRststbi__@u0tkxd', { name: 'Strasbourg, Grand-Est, France' });
```

<a name="updateStopCluster"></a>

## updateStopCluster

**syntax**: `groundPlacesService.updateStopCluster(stopClusterGpuid, propertiesToUpdate)`

**arguments**:

- _stopClusterGpuid_ (`StopClusterGpuid`): Ground place unique identifier of the StopCluster to update.
- _propertiesToUpdate_ (`UpdateGroundPlaceProperties`): Properties that need to be update.

**returns**: `void`

Update StopCluster specified properties with new values given.

**example**:

```ts
groundPlacesService.updateStopCluster('c|FRstrasbou@u0ts2', { name: 'Strasbourg, Est, France' });
```

<a name="addStopGroupToStopCluster"></a>

## addStopGroupToStopCluster

**syntax**: `groundPlacesService.addStopGroupToStopCluster(stopGroupGpuidToAdd, intoStopClusterGpuid)`

**arguments**:

- _stopGroupGpuidToAdd_ (`StopGroupGpuid`): Ground place unique identifier of the StopGroup to add.
- _intoStopClusterGpuid_ (`intoStopClusterGpuid`): Ground Place unique identifier of the new StopCluster parent.

**returns**: `void`

Add a StopGroup to a StopCluster.

**example**:

```ts
groundPlacesService.addStopGroupToStopCluster('g|FRnanvanna@u0skgb', 'c|FRnancy___@u0sku');
```

<a name="removeStopGroupFromStopCluster"></a>

## removeStopGroupFromStopCluster

**syntax**: `groundPlacesService.removeStopGroupFromStopCluster(stopGroupGpuidToRemove, stopClusterGpuidParent)`

**arguments**:

- _stopGroupGpuidToRemove_ (`StopGroupGpuid`): Ground place unique identifier of the StopGroup to remove.
- _stopClusterGpuidParent_ (`StopClusterGpuid`): Ground place unique identifier of the StopCluster parent.

**returns**: `void`

Remove the reference of a StopGroup from a StopCluster.

**example**:

```ts
groundPlacesService.removeStopGroupFromStopCluster('g|FRnancy___@u0skux', 'c|FRnaarto__@u0skg');
```

<a name="moveStopGroup"></a>

## moveStopGroup

**syntax**: `groundPlacesService.moveStopGroup(stopGroupToMoveGpuid, fromStopClusterGpuid, intoStopClusterGpuid)`

**arguments**:

- _stopGroupToMoveGpuid_ (`StopGroupGpuid`): Ground place unique identifier of the StopGroup to move.
- _fromStopClusterGpuid_ (`StopClusterGpuid`): Ground place unique identifier of the old StopCluster.
- _intoStopClusterGpuid_ (`StopClusterGpuid`): Ground place unique identifier of the new StopCluster.

**returns**: `void`

Move a StopGroup from a StopCluster to another StopCluster.

**example**:

```ts
const stopGroupToMoveGpuid = 'g|FRnanvanna@u0skgb';
const fromStopClusterGpuid = 'c|FRnaarto__@u0skg';
const intoStopClusterGpuid = 'c|FRnancy___@u0sku';

groundPlacesService.moveStopGroup(stopGroupToMoveGpuid, fromStopClusterGpuid, intoStopClusterGpuid);
```

<a name="moveSegmentProviderStop"></a>

## moveSegmentProviderStop

**syntax**: `groundPlacesService.moveSegmentProviderStop(segmentProviderStopId, fromStopGroupGpuid, intoStopGroupGpuid)`

**arguments**:

- _segmentProviderStopId_ (`string`): The identifier of the SegmentProvider to move.
- _fromStopClusterGpuid_ (`StopGroupGpuid`): Ground place unique identifier of the old StopGroup.
- _intoStopGroupGpuid_ (`StopGroupGpuid`): Ground place unique identifier of the new StopGroup.

**returns**: `void`

Move a SegmentProviderStop from a StopGroup to another StopGroup.

**example**:

```ts
const segmentProviderStopId = 'FRBUK';
const fromStopGroupGpuid = 'g|FRstraroet@u0tkr3';
const intoStopGroupGpuid = 'g|FRstrasbou@u0tkru';

groundPlacesService.moveSegmentProviderStop(segmentProviderStopId, fromStopGroupGpuid, intoStopGroupGpuid);
```

<a name="mergeStopGroup"></a>

## mergeStopGroup

**syntax**: `groundPlacesService.mergeStopGroup(stopGroupToMergeGpuid, intoStopGroupGpuid)`

**arguments**:

- _stopGroupToMergeGpuid_ (`StopGroupGpuid`): Ground place unique identifier of the StopGroup to merge.
- _intoStopGroupGpuid_ (`StopGroupGpuid`): Ground Place unique identifier of the StopGroup to be merged.

**returns**: `void`

Merge two StopGroups. It means moving all SegmentProviderStop of a StopGroup into another.

**example**:

```ts
const stopGroupToMergeGpuid = 'g|FRstrasbou@u0tkru';
const intoStopGroupGpuid = 'g|FRststbi__@u0tkxd';

groundPlacesService.mergeStopGroup(stopGroupToMergeGpuid, intoStopGroupGpuid);
```

<a name="mergeStopCluster"></a>

## mergeStopCluster

**syntax**: `groundPlacesService.mergeStopCluster(stopClusterToMergeGpuid, intoStopClusterGpuid)`

**arguments**:

- _stopClusterToMergeGpuid_ (`StopClusterGpuid`): Ground place unique identifier of the StopCluster to merge.
- _intoStopClusterGpuid_ (`StopClusterGpuid`): Ground place unique identifier of the StopCluster to be merged.

**returns**: `void`

Merge two StopClusters. It Means moving all stopGroup of a StopCluster into another.

**example**:

```ts
const stopClusterToMergeGpuid = 'c|FRnancy___@u0sku';
const intoStopClusterGpuid = 'c|FRnaarto__@u0skg';

groundPlacesService.mergeStopCluster(stopClusterToMergeGpuid, intoStopClusterGpuid);
```

<a name="deleteStopGroup"></a>

## deleteStopGroup

**syntax**: `groundPlacesService.deleteStopGroup(stopGroupGpuid)`

**arguments**:

- _stopGroupGpuid_ (`StopGroupGpuid`): Ground place unique identifier of the StopGroup to remove.

**returns**: `void`

Delete StopGroup only if it does not contains SegmentProviderStop.

**example**:

```ts
groundPlacesService.deleteStopGroup('g|FRststbi__@u0tkxd');
```

<a name="deleteStopCluster"></a>

## deleteStopCluster

**syntax**: `groundPlacesService.deleteStopCluster(stopClusterGpuid)`

**arguments**:

- _stopClusterGpuid_ (`StopClusterGpuid`): Ground place unique identifier of the StopCluster to remove.

**returns**: `void`

Delete StopCluster only if it does not contains StopGroup.

**example**

```ts
groundPlacesService.deleteStopCluster('c|FRnaarto__@u0skg');
```

<a name="getGroundPlaces"></a>

## getGroundPlaces

**syntax**: `groundPlacesService.getGroundPlaces()`

**returns**: `GroundPlace[]`

Get all the Ground places inside a manipulable array.

**example**:

```ts
const groundPlaces: GroundPlace[] = groundPlacesService.getGroundPlaces();
```

<a name="getGroundPlacesFile"></a>

## getGroundPlacesFile

**syntax**: `groundPlacesService.getGroundPlacesFile()`

**returns** `GroundPlacesFile`

Get all the Ground places JSON format file.

```ts
const groundPlacesFile: GroundPlacesFile = groundPlacesService.getGroundPlacesFile();
```

---
