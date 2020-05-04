#!/bin/bash

git tag `git describe` || true
GOVERSION=$(go version | awk '{print $3;}') goreleaser release --rm-dist --skip-validate
