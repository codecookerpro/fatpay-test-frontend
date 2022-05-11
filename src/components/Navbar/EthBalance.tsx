import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setEthBalance } from "../../reducers";

import web3 from "../Web3";

const EthBalance = (props: any) => {
  const dispatch = useDispatch();
  const ethBalance = useSelector((state: any) => state.main.ethBalance);
  const userAddress = useSelector((state: any) => state.main.userAddress);
  const connected = useSelector((state: any) => state.main.connected);

  useEffect(() => {
    const work = async () => {
      if(userAddress) {
        let balance = await web3.eth.getBalance(userAddress);
        balance = web3.utils.fromWei(balance, 'ether');
        dispatch(setEthBalance(balance));
      } 
    }
    work();
  }, [userAddress, dispatch]);

  return (
    <div className="flex items-center space-x-2 mx-5">
      {
        connected ? <span className="text-lg font-bold">{parseFloat(ethBalance).toFixed(5)} ETH</span> : ""
      }
    </div>
  )
}

export default EthBalance;