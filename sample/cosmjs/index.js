import dotenv from 'dotenv'
import signISCNTx from './sign.js';
import { signer } from './signer.js';

dotenv.config();

const payload = {
    "title": "使用矩陣計算遞歸關係式",
    "description": "An article on computing recursive function with matrix multiplication.",
    "tagsString": "article",
    "url": "https://nnkken.github.io/post/recursive-relation/",
    "license": "https://creativecommons.org/licenses/by/4.0",
    "ipfsHash": "ipfs://QmNrgEMcUygbKzZeZgYFosdd27VE9KnWbyUD73bKZJ3bGi",
    "fileSHA256": "hash://sha256/9564b85669d5e96ac969dd0161b8475bbced9e5999c6ec598da718a3045d6f2e",
    "authorNames": "Chung Wu",
    "authorUrls": "http://github.com/nnkken",
};

const address = "cosmos135h665npk02kn99mayfwr77m44y9ruqq4ua9tc"; // digital ocean node address
// const address = "cosmos1uqfcn4ppzlnus9cc5u5jekj2wrjexrs0c5gjs6"; // local node address

signISCNTx(payload, signer, address);