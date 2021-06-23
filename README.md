# ground-place-sdk

[![Dependencies][prod-dependencies-badge]][prod-dependencies]
[![Build][build-badge]][build]
[![License][license-badge]][license]
[![PRs Welcome][prs-badge]][prs]

## Description

This package offers the possibility to precisely manipulate a set of places, change their name, give them a new location, merge them together, etc.

The main goal is to easily manage groups of places by creating **Groups** or **Clusters** (Groups of groups) around points of interest that you have defined.

To ensure the proper usage of the package, the file of places provided must respect an specific interface that you can find [here](https://github.com/tictactrip/ground-place-sdk/blob/master/docs/ground_places_file_scheme.md).

## Install

```
yarn add @tictactrip/ground-place-sdk
```

## API

A documentation of the API is available [here](https://github.com/tictactrip/ground-place-sdk/blob/master/docs/api.md).

## How to use it?

Here is an usage example of the package that allows you to add and modify your ground places file.

```ts
import { GroundPlacesController, GroundPlacesFile } from '@tictactrip/ground-places-sdk';
import * as GroundPlacesFileJSON from './GroundPlacesFile.json';

// Create new instance of the GroundPlacesController
const groundPlacesService: GroundPlacesController = new GroundPlacesController();

// Initialize the package with your JSON file
groundPlacesService.init(GroundPlacesFileJSON as GroundPlacesFile);

// And now you can make manipulation on this file with all methods provided by the package
groundPlacesService.updateStopCluster('c|FRstrasbou@u0ts2', { name: 'Strasbourg, Est, France' });
groundPlacesService.mergeStopGroup('g|FRstrasbou@u0tkru', 'g|FRststbi__@u0tkxd');
groundPlacesService.deleteStopGroup('g|FRstrasbou@u0tkru');
...

// After your changes, you can retrieve all your Ground places modified in an JSON file like the input one.
groundPlacesService.getGroundPlacesFile();

// You can also get the history of all actions performed on the Ground places
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
