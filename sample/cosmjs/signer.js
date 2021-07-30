import secp256k1 from 'secp256k1';
import { bech32 } from 'bech32';
import createHash from 'create-hash';
import bip39 from 'bip39';
import bip32 from 'bip32';
// const jsonStringify = require('fast-json-stable-stringify');

// the code of `seedToPrivateKey` is derived from @lunie/cosmos-key
// https://github.com/luniehq/cosmos-keys/blob/2586e7af82fc52c2c2603383e850a1969539f4f1/src/cosmos-keys.ts
function seedToPrivateKey(mnemonic, hdPath = `m/44'/118'/0'/0/0`) {
  const seed = bip39.mnemonicToSeedSync(mnemonic)
  const masterKey = bip32.fromSeed(seed)
  const { privateKey } = masterKey.derivePath(hdPath)
  return privateKey
}

function createSigner(privateKey) {
  console.log(`private key: ${privateKey.toString('hex')}`);
  const publicKeyArr = secp256k1.publicKeyCreate(privateKey, true);
  const publicKey = Buffer.from(publicKeyArr);
  console.log(`public key: ${publicKey.toString('base64')}`);
  const sha256 = createHash('sha256');
  const ripemd = createHash('ripemd160');
  sha256.update(publicKey);
  ripemd.update(sha256.digest());
  const rawAddr = ripemd.digest();
  const toWords = bech32.toWords(rawAddr);
  const cosmosAddress = bech32.encode('cosmos', toWords);
  console.log(`address: ${cosmosAddress}`);
  const sign = (msg) => {
    const msgSha256 = createHash('sha256');
    msgSha256.update(msg);
    const msgHash = msgSha256.digest();
    const { signature: signatureArr } = secp256k1.ecdsaSign(msgHash, privateKey);
    const signature = Buffer.from(signatureArr)
    console.log(`signature: ${signature.toString('base64')}`);
    return { signature, publicKey };
  }
  console.log('cosmosAddress, sign', cosmosAddress, sign)
  return { cosmosAddress, sign };
}

// const privKey = Buffer.from('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', 'hex');
// may also derive private key from seed words:
const seed = "draw also begin dumb hub bounce dwarf news defy tent rail nation furnace dove thank accuse final jeans erupt gym attack pool shaft element";
const privKey = seedToPrivateKey(seed);
console.log('privKey', privKey)
export const signer = createSigner(privKey);

// const signBytes = jsonStringify({
//   "fee": {
//     "amount": [
//       {
//         "denom": "nanolike",
//         "amount": "44000000"
//       }
//     ],
//     "gas": "44000"
//   },
//   "msgs": [
//     {
//       "type": "cosmos-sdk/MsgSend",
//       "value": {
//         "from_address": "cosmos1mnyn7x24xj6vraxeeq56dfkxa009tvhgknhm04",
//         "to_address": "cosmos1ca0zlqxjqv5gek5qxm602umtkmu88564hpyws4",
//         "amount": [
//           {
//             "denom": "nanolike",
//             "amount": "123456789"
//           }
//         ]
//       }
//     }
//   ],
//   "chain_id": "likechain-testnet-taipei-1",
//   "account_number": "21",
//   "sequence": "0",
//   "memo": "",
// });

// signer.sign(signBytes);

// // private key: 0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
// // public key: A0ZGrlBHMWtCMNAIbIrOxofwCxzZ0dxjT2yzWKwKmo//
// // address: cosmos1mnyn7x24xj6vraxeeq56dfkxa009tvhgknhm04
// // signature: yXcQvLVEHZMIzZijEgmcL5S7orusBURZoRjWuG1IpoItt5DhY8P9TUaxx31huxV200l6GcEbUlB/Y7jONuf3Bw==