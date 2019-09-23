#!/usr/bin/env bash
set -euo pipefail

run_dir=$(pwd)
cd $(mktemp -d)

echo "Downloading build artefacts to temporary directory:"
pwd

curl https://api.github.com/repos/LN-Zap/zap-desktop/releases/latest | jq '.assets[].browser_download_url' | xargs wget

echo "Calculating checksums and signing the result..."

export GPG_TTY=$(tty)
shasum --algorithm 256 * | gpg --clearsign --local-user "Zap Solutions" > "$run_dir/SHASUMS256.txt.asc"

echo "Created SHASUM256.txt.asc"
