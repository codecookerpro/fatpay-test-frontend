import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setTokenBalance } from "../../reducers";

import web3 from "../Web3";

const TokenBalance = (props: any) => {
  const dispatch = useDispatch();
  const tokenBalance = useSelector((state: any) => state.main.tokenBalance);
  const userAddress = useSelector((state: any) => state.main.userAddress);
  const connected = useSelector((state: any) => state.main.connected);

  useEffect(() => {
    const work = async () => {
      if(userAddress) {
        try {
          let balance = await props.fatTokenContract?.methods?.balanceOf(userAddress).call();
          if(balance) {
            balance = web3.utils.fromWei(balance, 'ether');
            dispatch(setTokenBalance(balance));
          }
        } catch(e: any) {
          console.log(e);
        }
      }
    }
    work();
  }, [userAddress, dispatch, props]);

  return (
    <div className="card w-full bg-base-100 shadow-xl my-5">
      <div className="card-body">
        <h2 className="card-title">FatToken Balance</h2>
        <h3 className="card-title">
          {
            connected ? tokenBalance + " FAT20" : "Please connect wallet first"
          }
        </h3>
      </div>
    </div>
  )
}

export default TokenBalance;