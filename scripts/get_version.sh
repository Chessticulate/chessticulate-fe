#!/usr/bin/bash

VERSION=$(grep -oP '"version":\s*"\K[0-9]+\.[0-9]+\.[0-9]+' package.json)

echo "$VERSION"

