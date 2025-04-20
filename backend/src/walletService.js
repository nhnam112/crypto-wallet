const AWS = require('aws-sdk');
const { ethers } = require('ethers');
const { dotenv } = require('dotenv');

dotenv.config();

const kms = new AWS.KMS({ region: 'us-east-1' });
const KMS_KEY_ID = process.env.KMS_KEY_ID;

const NETWORKS = {
  ethereum: process.env.ETHEREUM_NETWORK,
  polygon: process.env.POLYGON_NETWORK,
  bsc: process.env.BCS_NETWORK
};

function getProvider(network) {
  return new ethers.providers.JsonRpcProvider(NETWORKS[network] || NETWORKS.ethereum);
}

let encryptedKeyMap = {};

exports.storePrivateKey = async (address, plainKey) => {
  const encrypted = await kms.encrypt({
    KeyId: KMS_KEY_ID,
    Plaintext: plainKey
  }).promise();

  encryptedKeyMap[address] = encrypted.CiphertextBlob.toString('base64');
};

exports.getBalance = async (address, network = 'ethereum') => {
  const provider = getProvider(network);
  const balance = await provider.getBalance(address);
  return ethers.utils.formatEther(balance);
};

exports.handleTransaction = async ({ address, to, value, network = 'ethereum' }) => {
  const encryptedKey = encryptedKeyMap[address];
  if (!encryptedKey) throw new Error('Private key not found');

  const decrypted = await kms.decrypt({
    CiphertextBlob: Buffer.from(encryptedKey, 'base64')
  }).promise();

  const provider = getProvider(network);
  const wallet = new ethers.Wallet(decrypted.Plaintext.toString(), provider);

  const tx = await wallet.sendTransaction({
    to,
    value: ethers.utils.parseEther(value)
  });

  await tx.wait();
  return { txHash: tx.hash, status: 'confirmed' };
};
