# API

## init

**syntax**: `GroundPlaces.init(groundPlacesFile)`

**arguments**:

- _groundPlacesFile_ (**GroundPlacesFile**): File that store all your `StopGroup`, `StopCluster` and `SegmentProviderStop`.

**returns**: `void`

This method allows you to initialize the Ground Places service with a file of ground places.

This file must be in **JSON** format and can contain an unlimited number of ground places, these places must respect the scheme defined **here**.

**Example**

```js
import { GroundPlacesFile } from '@tictactrip/ground-place-sdk';
import GroundPlacesFileJSON from './ground_places_file.json';

const groundPlacesService: GroundPlacesController = new GroundPlacesController();

groundPlacesService.init(GroundPlacesFileJSON as GroundPlacesFile);
```

---
