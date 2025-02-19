
#!/usr/bin/env bash

PWD=`pwd`
WD=`cd $(dirname "$0") && pwd -P`

cd "${WD}"
set -o errexit -o nounset -o pipefail
command -v shellcheck >/dev/null && shellcheck "$0"

ROOT_PROTO_DIR="../cosmos/cosmos-sdk"
COSMOS_PROTO_DIR="$ROOT_PROTO_DIR/proto"
THIRD_PARTY_PROTO_DIR="$ROOT_PROTO_DIR/third_party/proto"
ISCN_PROTO_DIR="../proto"
OUT_DIR="../src/"

echo $COSMOS_PROTO_DIR
rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

npx protoc \
  --plugin="$(yarn bin protoc-gen-ts_proto)" \
  --ts_proto_out="$OUT_DIR" \
  --proto_path="$COSMOS_PROTO_DIR" \
  --proto_path="$THIRD_PARTY_PROTO_DIR" \
  --proto_path="$ISCN_PROTO_DIR" \
  --ts_proto_opt="esModuleInterop=true,forceLong=long,useOptionals=true" \
  "$ISCN_PROTO_DIR/iscn/genesis.proto" \
  "$ISCN_PROTO_DIR/iscn/iscnid.proto" \
  "$ISCN_PROTO_DIR/iscn/params.proto" \
  "$ISCN_PROTO_DIR/iscn/query.proto" \
  "$ISCN_PROTO_DIR/iscn/store.proto" \
  "$ISCN_PROTO_DIR/iscn/tx.proto" \

rm -rf \
  "$OUT_DIR"/cosmos_proto/ \
  "$OUT_DIR"/gogoproto/ \
  "$OUT_DIR"/google/api/ \
  "$OUT_DIR"/google/protobuf/descriptor.ts

cd "${PWD}"
