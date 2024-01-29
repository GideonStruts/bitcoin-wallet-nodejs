const bitcoin = require("bitcoinjs-lib");
const ECPairFactory = require("ecpair").default;
const ecc = require("tiny-secp256k1");
const crypto = require("crypto");

// Set network to testnet
const network = bitcoin.networks.testnet;
const ECPair = ECPairFactory(ecc);

// var privateKey = Buffer.from(private_key, 'hex');
// var keyPair = ECPair.fromPrivateKey(privateKey, { network: network });

// Create a key pair
const keyPair = ECPair.makeRandom({ network });
const pubkey = keyPair.publicKey;

const myWalletAddress = "tb1qt3lh45alsqqta8n2ke3jfg4uu2m2mg4y0pdqpf";
const amount = 0.00061147;

const txid = "822aa49bd60305aaa5b6d5ce565a1e6e4b356af758c1fa15988ecb2a512c9cb2";

const fullRawTransactionHex =
  "020000000001017b09a43a7059cc2b0d5cdcba1752b05d56bc3bed300c761674051516fc58414b0100000000fdffffff02acd949030100000016001465932e06ecd8eccf49d4cac6c7fde7c5d384f4eeefde0000000000001600145c7f7ad3bf8000be9e6ab66324a2bce2b6ada2a40247304402207dc635528c153741874e6c7a8f7606d48544a02f72ebc06d48995f0c1b6ab69302205a6a1f6d5eb71735e1c0fbcee9e4fc96cd5b37035b055e2dba8280d46b2d6bca012102b648cfd1b4a507fe651b6544f0627713c66b62fb8bb3e0a232ac3e4b521814e2f14e2700";

function createWallet() {
  // Retrieve the public key
  const addressObject = bitcoin.payments.p2wpkh({ pubkey, network });
  let myNewWalletAddress = addressObject.address;
  console.log(myNewWalletAddress);
}

// createWallet() - commented out because I already generated the wallet address.
// mv4rnyY3Su5gjcDNzbMLKBQkBicCtHUtFB
console.log("myWalletAddress ==> " + myWalletAddress);

function buildAndSignTransaction() {
  const psbt = new bitcoin.Psbt({ network: network });
  const destinationAddress = "tb1qmjulhymt7h44mla7uan5nl8r2qdzvmpafta63a";
  const minerFee = 10000;
  const outputAmount = amount * 1e8 - minerFee;
  const outputNumber = 0;

  //   const pubkeys = [keyPair.publicKey].map((hex) => Buffer.from(hex, "hex"));
  const pubkeys = [keyPair.publicKey];

  const p2shObj = bitcoin.payments.p2sh({
    redeem: bitcoin.payments.p2ms({ m: 1, pubkeys, network: network }),
  });
  const { address } = p2shObj;
  const redeemScript = p2shObj.redeem.output;

  psbt.addInput({
    hash: txid,
    index: outputNumber,
    nonWitnessUtxo: Buffer.from(fullRawTransactionHex, "hex"),
    redeemScript: redeemScript,
  });

  psbt.addOutput({ address: destinationAddress, value: outputAmount });
  psbt.signInput(outputNumber, keyPair);
  console.log("valid signature: ", psbt.validateSignaturesOfAllInputs());

  psbt.finalizeInput(0);
  const rawTransaction = psbt.extractTransaction().toHex();

  console.log(rawTransaction);
  // https://blockstream.info/testnet/tx/push
}

buildAndSignTransaction();
