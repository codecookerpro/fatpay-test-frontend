import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';

import web3 from "../Web3";
import { setTotalClaimed } from "../../reducers";

const TotalClaimed = (props: any) => {
  const dispatch = useDispatch();
  const totalClaimed = useSelector((state: any) => state.main.totalClaimed);
  const userAddress = useSelector((state: any) => state.main.userAddress);
  const connected = useSelector((state: any) => state.main.connected);

  useEffect(() => {
    const work = async () => {
      if(userAddress) {
        try {
          let balance = await props.fatTokenContract?.methods?.getTotalClaimed(userAddress).call();
          if(balance) {
            balance = web3.utils.fromWei(balance, 'ether');
            dispatch(setTotalClaimed(balance));
          }
        }catch(e: any) {
          console.log(e);
        }
      }
    }
    work();
  }, [userAddress, dispatch, props]);

  return (
    <div className="card w-full bg-base-100 shadow-xl my-5">
      <div className="card-body">
        <h2 className="card-title">Total Claimed Rewards</h2>
        {
          connected ? <h3 className="card-title">{ totalClaimed } ETH</h3> : "Please connect metamask first"
        }
      </div>
    </div>
  )
}

export default TotalClaimed;