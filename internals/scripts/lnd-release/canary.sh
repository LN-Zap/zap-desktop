#!/bin/bash

git tag `git describe` || true
goreleaser release --rm-dist --skip-validate
