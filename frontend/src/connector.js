import Web3Auth from "@web3auth/web3auth";

const web3auth = new Web3Auth({
  clientId: process.env.REACT_APP_WEB3_CLIENTID,
  chainConfig: {
    chainNamespace: process.env.REACT_APP_CHAIN_NAMESPACE,
    chainId: process.env.REACT_APP_CHAIN_ID,
    rpcTarget: process.env.REACT_APP_RPC_TARGET
  }
});

export async function connectWallet() {
  await web3auth.initModal();
  await web3auth.connect();
}
