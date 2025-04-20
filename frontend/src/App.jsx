import React, { useState } from 'react';
import { connectWallet } from './connector';
import { login, sendTransaction, getBalance } from './provider';

const NETWORK_OPTIONS = ['ethereum', 'polygon', 'bsc'];

function App() {
  const [address, setAddress] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [balance, setBalance] = useState('');
  const [txTo, setTxTo] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txHash, setTxHash] = useState('');
  const [network, setNetwork] = useState('ethereum');

  const handleLogin = async () => {
    await connectWallet();
    const addr = prompt('Enter wallet address:');
    const key = prompt('Enter private key:');
    setAddress(addr);
    setPrivateKey(key);
    login(addr, key);
  };

  const checkBalance = () => {
    getBalance(address, network, (bal) => setBalance(bal));
  };

  const handleSendTx = () => {
    sendTransaction({ address, to: txTo, value: txAmount, network });
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Simple Crypto Wallet</h1>
      <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded">Connect Wallet</button>

      <div>
        <label className="block font-medium mt-4">Select Network</label>
        <select value={network} onChange={e => setNetwork(e.target.value)} className="border p-2 rounded w-full">
          {NETWORK_OPTIONS.map(net => <option key={net} value={net}>{net.toUpperCase()}</option>)}
        </select>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Balance</h2>
        <button onClick={checkBalance} className="bg-gray-200 px-2 py-1 rounded">Get Balance</button>
        <p>{balance ? `${balance} ${network.toUpperCase()}` : 'No balance yet'}</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Send Transaction</h2>
        <input type="text" placeholder="To address" value={txTo} onChange={e => setTxTo(e.target.value)} className="border p-1 rounded w-full" />
        <input type="text" placeholder="Amount" value={txAmount} onChange={e => setTxAmount(e.target.value)} className="border p-1 rounded w-full mt-2" />
        <button onClick={handleSendTx} className="bg-green-600 text-white px-4 py-2 rounded mt-2">Send</button>
      </div>

      {txHash && <p>Transaction sent: {txHash}</p>}
    </div>
  );
}

export default App;
