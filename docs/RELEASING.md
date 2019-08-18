# Releasing

## Table of Contents

- [Overview](#overview)
- [Building](#building)
- [Publishing](#publishing)
- [Release notes](#release-notes)
- [Signing](#signing)
- [Releasing](#releasing)

## Overview

We use [Electron Builder](https://github.com/electron-userland/electron-builder) to build and package the app for production. This gets uploaded to Github, reviewed, tested, documented, signed, and then finally released.

The final releases can be [downloaded from Github](https://github.com/LN-Zap/zap-desktop/releases).

Existing users that have autoupdates enabled will be promoted to download the new release automatically from within Zap.

## Building

As part of our automated build process, CI builds on either the `master` or `next` branch will include a build job that generates a production ready release.

## Publishing

Create a draft release node on Github:

- Set the tag version to match the version of the upcoming release as specified in [`package.json`](../package.json), with prepended `v`, e.g. `v0.5.3-beta`
- Set the branch target branch to `master` for public releases.
- Title the release accordingly.

Once a correctly named draft release exists on Github, the publish phase of our CI jobs will also run at the end of the build process. This will publish the release assets directly to draft Github release.

As long as the draft release exists, each new commit to the `next` or `master` branch will cause the release assets to be rebuilt and reuploaded to the draft relase on Github, ensuring that it always includes an up to date build that is ready for testing.

Mac and Linux builds are generated on [Travis](https://travis-ci.com/LN-Zap/zap-desktop) whilst Windows builds are generated on [Appveyor](https://ci.appveyor.com/project/LN-Zap/zap-desktop).

## Release notes

Release notes are automatimacally generated from our commit logs using [standard-changelog](https://www.npmjs.com/package/standard-changelog).

```sh
$ npm install -g standard-changelog
$ cd zap-desktop
$ standard-changelog
```

Review the generated release notes and then copy/paste them onto the draft release on Github.

## Signing

As part of the build process Electron Builder will automaitcally sign the release assets with our code signing certificates. This enables Mac and Windows users to install the software without any warnings from their operating system.

In addition, we generate a file that contains a checksum of each release asset and then sign this file with the Zap Solutions GPG key.

The following command can be used to sign a release:

```sh
$ cd zap-desktop
$ ./scripts/signedchecksum.sh
```

This will generate a file named `SHASUMS256.txt.asc` which should be uploaded to the draft release just prior to releasing. This ensures that our users can verify that the package they download was indeed the one created and signed by Zap.

## Releasing

Prior to releaseing, verify that the draft release is ready for publishing:

- [ ] The latest build on the `master` branch is green.
- [ ] The release has been downloaded and passes manual QA.
- [ ] Release notes have been added to the Github draft release.
- [ ] The release has been signed and `SHASUMS256.txt.asc` has been uploaded to the draft release on Github.

When ready to release, publish the draft release to make it publically accessible.
