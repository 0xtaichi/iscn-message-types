#!/usr/bin/env bash

PWD=`pwd`
WD=`cd $(dirname "$0") && pwd -P`

cd "${WD}"

set -o errexit -o nounset -o pipefail
command -v shellcheck >/dev/null && shellcheck "$0"

COSMOS_SDK_REF='v0.42.6'

PROTO_DIR="../proto"
COSMOS_DIR="../cosmos"
COSMOS_SDK_DIR="$COSMOS_DIR/cosmos-sdk"
ZIP_FILE="$COSMOS_DIR/tmp.zip"
COSMOS_SDK_REF=${COSMOS_SDK_REF:-"master"}
SUFFIX=${COSMOS_SDK_REF}

[[ $SUFFIX =~ ^v[0-9]+\.[0-9]+\.[0-9]+(-.+)?$ ]] && SUFFIX=${SUFFIX#v}

rm -rf "$COSMOS_DIR"
mkdir -p "$COSMOS_DIR"

curl -Lo "$ZIP_FILE" "https://github.com/cosmos/cosmos-sdk/archive/$COSMOS_SDK_REF.zip"
unzip "$ZIP_FILE" "*.proto" -d "$COSMOS_DIR"
mv "$COSMOS_SDK_DIR-$SUFFIX" "$COSMOS_SDK_DIR"
rm "$ZIP_FILE"

cd "${PWD}"
