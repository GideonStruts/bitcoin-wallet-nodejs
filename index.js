const bitcoin = require("bitcoinjs-lib");
const ECPairFactory = require("ecpair").default;
const ecc = require("tiny-secp256k1");

// Set network to testnet
const network = bitcoin.networks.testnet;

// Create a key pair
const ECPair = ECPairFactory(ecc);
const keypair = ECPair.makeRandom({ network });

// Retrieve the public key
const pubkey = keypair.publicKey;

const addressObject = bitcoin.payments.p2pkh({ pubkey, network });
console.log(addressObject.address);
