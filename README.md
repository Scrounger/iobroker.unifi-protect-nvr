<img src="admin/unifi-protect-nvr.svg" width="200" height="200" />

# ioBroker.unifi-protect-nvr

[![NPM version](https://img.shields.io/npm/v/iobroker.unifi-protect-nvr.svg)](https://www.npmjs.com/package/iobroker.unifi-protect-nvr)
[![Downloads](https://img.shields.io/npm/dm/iobroker.unifi-protect-nvr.svg)](https://www.npmjs.com/package/iobroker.unifi-protect-nvr)
![Number of Installations](https://iobroker.live/badges/unifi-protect-nvr-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/unifi-protect-nvr-stable.svg)

[![NPM](https://nodei.co/npm/iobroker.unifi-protect-nvr.png?downloads=true)](https://nodei.co/npm/iobroker.unifi-protect-nvr/)

**Tests:** ![Test and Release](https://github.com/Scrounger/ioBroker.unifi-protect-nvr/workflows/Test%20and%20Release/badge.svg)

## unifi-protect-nvr adapter for ioBroker

Unifi Protect Adapter for ioBroker based on the great [unifi-protect library from hjdhjd](https://github.com/hjdhjd/unifi-protect).\
This adapter uses the websocket interface to receive real-time information from the unifi-protect application

### Tested Devices

The following devices have been successfully tested with the adapter.

| Model             |  Type  | Success |
| ----------------- | :----: | :-----: |
| UDM-PRO           |  NVR   |    ✔    |
| UDM-SE            |  NVR   |    ✔    |
| G3 Flex           | Camera |    ✔    |
| G4 Dome           | Camera |    ✔    |
| G4 Instant        | Camera |    ✔    |
| G5 Pro + Enhancer | Camera |    ✔    |
| G5 Turret Ultra   | Camera |    ✔    |

## Developer manual

This section is intended for the developer. It can be deleted later.

### DISCLAIMER

Please make sure that you consider copyrights and trademarks when you use names or logos of a company and add a disclaimer to your README.
You can check other adapters for examples or ask in the developer community. Using a name or logo of a company without permission may cause legal problems for you.

### Getting started

You are almost done, only a few steps left:

1. Create a new repository on GitHub with the name `ioBroker.unifi-protect-nvr`
1. Initialize the current folder as a new git repository:
   ```bash
   git init -b main
   git add .
   git commit -m "Initial commit"
   ```
1. Link your local repository with the one on GitHub:

   ```bash
   git remote add origin https://github.com/Scrounger/ioBroker.unifi-protect-nvr
   ```

1. Push all files to the GitHub repo:
   ```bash
   git push origin main
   ```
1. Add a new secret under https://github.com/Scrounger/ioBroker.unifi-protect-nvr/settings/secrets. It must be named `AUTO_MERGE_TOKEN` and contain a personal access token with push access to the repository, e.g. yours. You can create a new token under https://github.com/settings/tokens.

1. Head over to [main.js](main.js) and start programming!

### Best Practices

We've collected some [best practices](https://github.com/ioBroker/ioBroker.repositories#development-and-coding-best-practices) regarding ioBroker development and coding in general. If you're new to ioBroker or Node.js, you should
check them out. If you're already experienced, you should also take a look at them - you might learn something new :)

### Scripts in `package.json`

Several npm scripts are predefined for your convenience. You can run them using `npm run <scriptname>`
| Script name | Description |
|-------------|-------------|
| `test:js` | Executes the tests you defined in `*.test.js` files. |
| `test:package` | Ensures your `package.json` and `io-package.json` are valid. |
| `test:integration` | Tests the adapter startup with an actual instance of ioBroker. |
| `test` | Performs a minimal test run on package files and your tests. |
| `check` | Performs a type-check on your code (without compiling anything). |
| `lint` | Runs `ESLint` to check your code for formatting errors and potential bugs. |
| `translate` | Translates texts in your adapter to all required languages, see [`@iobroker/adapter-dev`](https://github.com/ioBroker/adapter-dev#manage-translations) for more details. |
| `release` | Creates a new release, see [`@alcalzone/release-script`](https://github.com/AlCalzone/release-script#usage) for more details. |

### Writing tests

When done right, testing code is invaluable, because it gives you the
confidence to change your code while knowing exactly if and when
something breaks. A good read on the topic of test-driven development
is https://hackernoon.com/introduction-to-test-driven-development-tdd-61a13bc92d92.
Although writing tests before the code might seem strange at first, but it has very
clear upsides.

The template provides you with basic tests for the adapter startup and package files.
It is recommended that you add your own tests into the mix.

### Publishing the adapter

Using GitHub Actions, you can enable automatic releases on npm whenever you push a new git tag that matches the form
`v<major>.<minor>.<patch>`. We **strongly recommend** that you do. The necessary steps are described in `.github/workflows/test-and-release.yml`.

Since you installed the release script, you can create a new
release simply by calling:

```bash
npm run release
```

Additional command line options for the release script are explained in the
[release-script documentation](https://github.com/AlCalzone/release-script#command-line).

To get your adapter released in ioBroker, please refer to the documentation
of [ioBroker.repositories](https://github.com/ioBroker/ioBroker.repositories#requirements-for-adapter-to-get-added-to-the-latest-repository).

### Test the adapter manually on a local ioBroker installation

In order to install the adapter locally without publishing, the following steps are recommended:

1. Create a tarball from your dev directory:
   ```bash
   npm pack
   ```
1. Upload the resulting file to your ioBroker host
1. Install it locally (The paths are different on Windows):
   ```bash
   cd /opt/iobroker
   npm i /path/to/tarball.tgz
   ```

For later updates, the above procedure is not necessary. Just do the following:

1. Overwrite the changed files in the adapter directory (`/opt/iobroker/node_modules/iobroker.unifi-protect-nvr`)
1. Execute `iobroker upload unifi-protect-nvr` on the ioBroker host

## Changelog

<!--
	Placeholder for the next version (at the beginning of the line):
	### **WORK IN PROGRESS**
-->
### 1.0.0-alpha.6 (2024-06-22)

- (Scrounger) work in progress

### 1.0.0-alpha.5 (2024-06-19)

- (Scrounger) work in progress

### 1.0.0-alpha.4 (2024-06-17)

- (Scrounger) work in progress

### 1.0.0-alpha.3 (2024-06-14)

- (Scrounger) work in progress

### 1.0.0-alpha.2 (2024-06-11)

- (Scrounger) bug fixes

### 1.0.0-alpha.1 (2024-06-09)

- (Scrounger) testing fix

### 1.0.0-alpha.0 (2024-06-09)

- (Scrounger) initial release

## License

MIT License

Copyright (c) 2024 Scrounger <scrounger@gmx.net>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
