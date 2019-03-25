# lnd-release

We use [GoReleaser](https://goreleaser.com/) to build and publish the lnd binaries that we distribute with Zap. These are the steps to create a new release.

### 1. Install GoReleaser

See https://goreleaser.com/

### 2. Fetch lnd

Fetch the lnd source code.

```
go get -d github.com/lightningnetwork/lnd
```

### 3. Copy release scripts

Copy the scripts provided in `scripts/lnd-release` over to the lnd working dir.

```
cp .goreleaser.yml $GOPATH/src/github.com/lightningnetwork/lnd/
cp canary.sh $GOPATH/src/github.com/lightningnetwork/lnd/
```

### 4. Create new release

Run the provided release script, which will create a new git tag and then build and publish the lnd binaries.

```
cd $GOPATH/src/github.com/lightningnetwork/lnd
GITHUB_TOKEN=... ./canary.sh
```

You must set `GITHUB_TOKEN` to a github access token that has the ability to publish releases on the https://github.com/LN-Zap/lnd repo.

### 5. Verify the new release

Verify that the new build has been published to https://github.com/LN-Zap/lnd/releases
