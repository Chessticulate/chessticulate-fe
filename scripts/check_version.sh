#!/usr/bin/bash
# This script is meant to be used exclusively by the
# CI workflow located in `.github/workflows/ci.yml`.
# It is responsible for comparing the versions of feature
# branches with the version of the main branch. It will
# close with a non-zero exit code if the current
# feature branch's package.json version string is not
# greater than that of the main branch.

if [ -n "$(git branch | grep '* main')" ]
then
    # No need to check version increment if this is being run on the main branch
    exit 0
fi

get_version() {
    local VERSION=$(grep -oP '"version":\s*"\K[0-9]+\.[0-9]+\.[0-9]+' package.json)
    VERSION=$(echo $VERSION | cut -d'"' -f2)
    echo $VERSION
}


# setting versions as env variables instead of passing to node script as arguments
export THIS_BRANCH_VERSION=$(get_version)

cd ..
if [ -d "chessticulate-fe_main" ]; then
    rm -rf chessticulate-fe_main
fi
git clone -b main --single-branch https://github.com/chessticulate/chessticulate-fe.git chessticulate-fe_main > /dev/null 2>&1
cd chessticulate-fe_main

npm install --silent semver 

export MAIN_BRANCH_VERSION=$(get_version)

# Compare versions using a Node.js script
NODE_COMPARE_VERS="
const semver = require('semver');
const mainVersion = process.env.MAIN_BRANCH_VERSION;
const thisVersion = process.env.THIS_BRANCH_VERSION;

if (semver.gt(thisVersion, mainVersion)) {
    process.exit(0);
} else {
    process.exit(1);
}
"

node -e "$NODE_COMPARE_VERS" 

EXIT_CODE=$?

if [ "$EXIT_CODE" != "0" ]
then
    echo "'${THIS_BRANCH_VERSION}' is not greater than '${MAIN_BRANCH_VERSION}'"
fi

exit $EXIT_CODE

