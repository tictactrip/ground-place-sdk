# ground-place-sdk

[![Dependencies][prod-dependencies-badge]][prod-dependencies]
[![Build][build-badge]][build]
[![License][license-badge]][license]
[![PRs Welcome][prs-badge]][prs]

## Description

This repository offers powerful JSON file manipulation methods for Ground places use.

## Install

```
yarn add @tictactrip/ground-place-sdk
```

## How to use it?

```ts
import { GroundPlacesController, GroundPlacesFile } from '@tictactrip/ground-places-sdk';
import * as GroundPlacesFileJSON from './GroundPlacesFile.json';

// Create new instance of the GroundPlacesController
const groundPlacesService: GroundPlacesController = new GroundPlacesController();

// Initialize the instance with your JSON file
groundPlacesService.init(GroundPlacesFileJSON as GroundPlacesFile);

// And now you can make manipulation on this file with all methods provided by the package
groundPlacesService.updateStopCluster('c|FRstrasbou@u0ts2', { name: 'Strasbourg, Est, France' });
groundPlacesService.mergeStopGroup('g|FRstrasbou@u0tkru', 'g|FRststbi__@u0tkxd');
groundPlacesService.deleteStopGroup('g|FRstrasbou@u0tkru');
...

// You can get all the Ground places
groundPlacesService.getGroundPlaces();

// And also get the history of all actions performed on the Ground places
groundPlacesService.getGroundPlacesActionHistory();
```

## Scripts

Run using yarn run `<script>` command.

    clean       - Remove temporarily folders.
    build       - Compile source files.
    build:watch - Interactive watch mode, compile sources on change.
    lint        - Lint source files.
    lint:fix    - Fix lint source files.
    test        - Runs all tests with coverage.
    test:watch  - Interactive watch mode, runs tests on change.

## License

GPL-3.0 © [Tictactrip](https://www.tictactrip.eu)

[prod-dependencies-badge]: https://david-dm.org/tictactrip/ground-place-sdk/status.svg
[prod-dependencies]: https://david-dm.org/tictactrip/ground-place-sdk
[build-badge]: https://github.com/tictactrip/ground-places-sdk/workflows/Test/badge.svg
[build]: https://github.com/tictactrip/ground-places-sdk/actions?query=workflow%3ATest+branch%3Amaster
[license-badge]: https://img.shields.io/badge/license-GPL3-blue.svg?style=flat-square
[license]: https://github.com/tictactrip/ground-place-sdk/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
