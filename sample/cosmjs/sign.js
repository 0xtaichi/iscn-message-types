import { Registry, DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import {
  defaultRegistryTypes,
  assertIsBroadcastTxSuccess,
  SigningStargateClient,
} from "@cosmjs/stargate";
import iscn from "@likecoin/iscn-message-types";

const { MsgCreateIscnRecord } = iscn.tx;

const registry = new Registry([
  ...defaultRegistryTypes,
  ["/likechain.iscn.MsgCreateIscnRecord", MsgCreateIscnRecord],
]);

function formatISCNPayload(payload, version = 1) {
  const {
    title,
    description,
    tagsString,
    url,
    license,
    ipfsHash,
    fileSHA256,
    authorNames,
    authorUrls,
  } = payload;

  const contentFingerprints = [];
  if (fileSHA256) contentFingerprints.push(`hash://sha256/${fileSHA256}`);
  if (ipfsHash) contentFingerprints.push(`ipfs://${ipfsHash}`);
  const stakeholders = [];
  if (authorNames.length) {
    for (let i = 0; i < authorNames.length; i += 1) {
      const authorName = authorNames[i];
      const authorUrl = authorUrls[i];
      const isNonEmpty = authorUrl || authorName;
      if (isNonEmpty) {
        stakeholders.push(Buffer.from(JSON.stringify({
          entity: {
            id: authorUrl || undefined,
            name: authorName,
          },
          rewardProportion: 1,
          contributionType: 'http://schema.org/author',
        }), 'utf8'))
      }
    }
  }
  const contentMetadata = {
    "@context": "http://schema.org/",
    "@type": "CreativeWorks",
    title,
    description,
    version,
    url,
    keywords: tagsString,
    usageInfo: license,
  };
  return {
    recordNotes: '',
    contentFingerprints,
    stakeholders,
    contentMetadata: Buffer.from(JSON.stringify(contentMetadata), 'utf8'),
  };
}

export async function signISCNTx(payload, signer, address) {
  console.log('process.env.rpcURL', process.env.rpcURL)
  try {
    // digital ocean node mnemonic
    // const mnemonic = "person regular host recall weapon brave turn fabric turtle shoot spatial certain require donate swear buzz praise priority desk find rocket client sight special";
    
    // local node mnemonic
    const mnemonic = "tell time reflect upper asset swim wasp woman hip upper portion notable ask defense scrub bullet tenant version cause essay utility kitchen until interest";
    
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic);
    const [firstAccount] = await wallet.getAccounts();

    console.log('wallet', wallet)
    console.log('firstAccount', firstAccount)

    const client = await SigningStargateClient.connectWithSigner(
      "165.22.51.240:26657", //"127.0.0.1:26657",
      wallet,//signer,
      { registry }
    );

    console.log('client', client);
  
    const record = formatISCNPayload(payload);
    console.log('record', record);
  
    const message = {
      typeUrl: "/likechain.iscn.MsgCreateIscnRecord",
      value: {
        from: address,
        record,
      },
    };
    const fee = {
      amount: [{ amount: '1000000', denom: 'nanolike' }],
      gas: '1000000',
    };
    const memo = 'iscn sign';
  
    const response = await client.signAndBroadcast(address, [message], fee, memo);
    console.log('response', response);
    
    assertIsBroadcastTxSuccess(response);
    
    return response;
    
  } catch (error) {
    console.log('error', error);
    
  }
  
}

export default signISCNTx;
