# Signatures

## Table of Contents

- [Overview](#overview)
- [Signing Keys](#signing-keys)
- [Importing Signing Keys](#importing-signing-keys)
- [Verifying Signatures](#verifying-signatures)
- [Verifying Checksums](#verifying-checksums)

## Overview

This guide covers Zap release packages signing and how to verify the signatures on downloaded release artifacts.

Release signing allows users to verify that the artifacts they have downloaded were published by a trusted party (such as a team or package distribution service). This can be done using GPG command line tools. Package management tools such as `apt` and `yum` also verify repository signatures.

## Signing Keys

All Zap release artifacts are signed using [GnuPG](http://www.gnupg.org/) and [our release signing key](https://github.com/LN-Zap/signing-keys/releases/download/1.0/zap-release-signing-key.asc).

## Importing Signing Keys

Before signatures can be verified, the Zap [signing key](https://github.com/LN-Zap/signing-keys/releases/download/1.0/zap-release-signing-key.asc) must be downloaded. The key can be obtained directly or using the [SKS keyservers pool](https://sks-keyservers.net/overview-of-pools.php). The direct download method is recommended because SKS servers are prone to overload.

### Direct Download

The key is distributed via [GitHub](https://github.com/LN-Zap/signing-keys/releases/) and [Keybase](https://keybase.io/ln_zap)

**Import from Keybase:**

```sh
$ curl https://keybase.io/ln_zap/pgp_keys.asc | gpg --import
```

**Import from Github:**

```sh
$ curl -L https://github.com/LN-Zap/signing-keys/releases/download/1.0/zap-release-signing-key.asc --output zap-release-signing-key.asc
$ gpg --import zap-release-signing-key.asc
```

### Using a Key Server

The key can also be imported using an [SKS keyservers pool](https://sks-keyservers.net/overview-of-pools.php):

```sh
$ gpg --keyserver "sks-keyservers.net" --recv-keys "539D6D2E45772011E6F21B427F267CF192D42A1A"
```

## Verifying Signatures

To check signatures for the packages, download the Zap signing key
and a signature file. Signature files use the `.asc` extension, e.g. `SHASUMS256.txt.asc`.

Then use `gpg --verify`:

```sh
$ gpg --verify [filename].asc
```

Here's an example session, after having retrieved a Zap source archive and its associated detached signature from the download area:

```sh
$ gpg --verify SHASUMS256.txt.asc
gpg: Signature made Sat 17 Aug 15:48:54 2019 CEST
gpg:                using RSA key CD8D406569B5047AC1BD8CBB7C0D9E4A52F34905
gpg:                issuer "zap@zaphq.io"
gpg: Good signature from "Zap Solutions <zap@zaphq.io>" [ultimate]
```

If the signature is invalid, a "BAD signature" message will be emitted. If that's the case the origin of the package, the signature file and the signing key should be carefully verified. Packages that fail signature verification must not be used.

If the signature is valid, you should expect a "Good signature" message; if you've not signed our key, you will see a "Good signature" message along with a warning about our key being untrusted.

If you trust the Zap signing key you avoid the warning output by GnuPG by signing it using your own key (to create your private key run `gpg --gen-key`):

```sh
$ gpg --sign-key 539D6D2E45772011E6F21B427F267CF192D42A1A
```

## Verifying Checksums

Once you have verified the authenticity of `SHASUMS256.txt.asc`, you should re-calculate the `sha256` sum of the download, and compare that with the hashes shown in `SHASUMS256.txt.asc`.

Then use `shasum`:

```sh
$ shasum -a 256 [filename]
```

Here's an example session, after having retrieved a Zap release package and its associated detached signature from the download area, re-compute the sha256 hash of the target file for your operating system.

```sh
$ shasum -a 256 Zap-mac-v0.5.2-beta.dmg
```

The produced hash should be compared with the hashes listed in `SHASUMS256.txt.asc` and they should match exactly.
