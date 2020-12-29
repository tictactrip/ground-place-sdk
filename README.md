# ground-place-sdk

[![Dependencies][prod-dependencies-badge]][prod-dependencies]
[![Coverage][coverage-badge]][coverage]
[![Build Status][travis-badge]][travis-ci]
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

// Once your changes are complete, you can download a JSON file of your changes
groundPlacesService.downloadGroundPlacesDiffToDesktop();

// Apply the diff file on your GroundPlacesFile
groundPlacesService.applyGroundPlacesDiff(GroundPlacesDiffFileJson);

// And download your new GroundPlacesFile with all the changes made before
groundPlacesService.downloadGroundPlacesFileToDesktop();
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
[coverage-badge]: https://codecov.io/gh/tictactrip/ground-place-sdk/branch/master/graph/badge.svg
[coverage]: https://codecov.io/gh/tictactrip/ground-place-sdk
[travis-badge]: https://travis-ci.org/tictactrip/ground-place-sdk.svg?branch=master
[travis-ci]: https://travis-ci.org/tictactrip/ground-place-sdk
[license-badge]: https://img.shields.io/badge/license-GPL3-blue.svg?style=flat-square
[license]: https://github.com/tictactrip/ground-place-sdk/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
