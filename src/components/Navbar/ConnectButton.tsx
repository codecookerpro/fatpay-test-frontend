import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setConnected, setUserAddress } from "../../reducers";

const isBrowser = () => typeof window !== "undefined"

function isMetaMaskInstalled() {
  if (isBrowser())
    return Boolean(window.ethereum);
  return false;
}

async function readAddress() {
  const method = "eth_requestAccounts";

  const accounts = await window.ethereum.request<string[]>({
    method
  });

  return accounts[0];
}

// function getSelectedAddress() {
//   return window.ethereum?.selectedAddress;
// }

const ConnectButton: React.FC<{
  onChange: (address: string | undefined) => void;
}> = ({ onChange }) => {
  const [address, setAddress] = useState<string | undefined>();
  const dispatch = useDispatch();

  const connectWallet = async () => {
    const selectedAddress = await readAddress();
    dispatch(setUserAddress(selectedAddress));
    dispatch(setConnected(true));
    setAddress(selectedAddress);
    onChange(selectedAddress);
  };

  useEffect(() => {
    const work = async () => {
      const selectedAddress = await readAddress();
      setAddress(selectedAddress);
      dispatch(setUserAddress(selectedAddress));
      dispatch(setConnected(true));
    }
    work();
  }, [dispatch]);

  useEffect(() => {
    const eventName = `accountsChanged`;

    if (!isMetaMaskInstalled()) {
      console.log('Please install metamask first');
      return;
    }

    const listener = ([selectedAddress]: string[]) => {
      setAddress(selectedAddress);
      dispatch(setUserAddress(selectedAddress));
      if(selectedAddress == null)
        dispatch(setConnected(false));
      else 
        dispatch(setConnected(true));
      onChange(selectedAddress);
    };

    window.ethereum.on(eventName, listener);

    return () => {
      window.ethereum.removeListener(eventName, listener);
    };
  }, [onChange, dispatch]);

  // if (!isMetaMaskInstalled()) {
  //   return <div>No wallet found. Please install MetaMask.</div>;
  // }

  return (
    <div className="flex-none">
      <button
        className="btn btn-sm neutral w-54 normal-case"
        onClick={connectWallet}
      >
        {
          address ? address.slice(0, 10) + '...' : "Connect Metamask"
        }
      </button>
    </div>
  )
};

export default ConnectButton;