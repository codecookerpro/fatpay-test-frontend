import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';

import web3 from "../Web3";
import { setOperationFee, setRewardFee, setPremiumRewardFee, setLiquidityFee, setRewardBalance, setPremiumRewardBalance } from "../../reducers";

const Stats = (props: any) => {
  const dispatch = useDispatch();
  const userAddress = useSelector((state: any) => state.main.userAddress);
  const connected = useSelector((state: any) => state.main.connected);

  const rewardBalance = useSelector((state: any) => state.main.rewardBalance);
  const premiumRewardBalance = useSelector((state: any) => state.main.premiumRewardBalance);

  const [tokenThreshold, setTokenThreshold] = useState("0");
  const [operationFee, setOperationFee] = useState("0");
  const [rewardFee, setRewardFee] = useState("0");
  const [premiumRewardFee, setPremiumRewardFee] = useState("0");
  const [liquidityFee, setLiquidityFee] = useState("0");

  const [pair, setPair] = useState("0");
  const [rewardAddress, setRewardAddress] = useState("");
  const [premiumRewardAddress, setPremiumRewardAddress] = useState("");
  const [lockCount, setLockCount] = useState("0");
  const [protectedCount, setProtectedCount] = useState("0");
  const [blacklistedCount, setBlacklistedCount] = useState("0");

  useEffect(() => {
    const work = async () => {
      if(userAddress) {
        
        try {
          let operationFee = await props.fatTokenContract?.methods?._operationFeeAmount().call();
          if(operationFee) {
            operationFee = web3.utils.fromWei(operationFee, 'ether');
            setOperationFee(operationFee); 
          }

          let rewardFee = await props.fatTokenContract?.methods?._rewardFeeAmount().call();
          if(rewardFee) {
            rewardFee = web3.utils.fromWei(rewardFee, 'ether');
            setRewardFee(rewardFee); 
          }

          let premiumRewardFee = await props.fatTokenContract?.methods?._premiumRewardFeeAmount().call();
          if(premiumRewardFee) {
            premiumRewardFee = web3.utils.fromWei(premiumRewardFee, 'ether');
            setPremiumRewardFee(premiumRewardFee); 
          }

          let liquidityFee = await props.fatTokenContract?.methods?._liquidityFeeAmount().call();
          if(liquidityFee) {
            liquidityFee = web3.utils.fromWei(liquidityFee, 'ether');
            setLiquidityFee(liquidityFee); 
          }

          let threshold = await props.fatTokenContract?.methods?._tokenThreshold().call();
          if(threshold) {
            threshold = web3.utils.fromWei(threshold, 'ether');
            setTokenThreshold(threshold); 
          }

          let lockCount = await props.fatTokenContract?.methods?.lockedCount().call();
          if(lockCount != undefined) {
            setLockCount(lockCount);
          }

          let protectedCount = await props.fatTokenContract?.methods?.protectedCount().call();
          if(protectedCount != undefined) {
            setProtectedCount(protectedCount);
          }

          let blacklistedCount = await props.fatTokenContract?.methods?.blacklistedCount().call();
          if(blacklistedCount != undefined) {
            setBlacklistedCount(blacklistedCount);
          }

          let pair = await props.fatTokenContract?.methods?.pair().call();
          if(pair) {
            setPair(pair); 
          }

          let rewardAddress = await props.fatTokenContract?.methods?._rewardAddress().call();
          if(rewardAddress != undefined) {
            setRewardAddress(rewardAddress);
            let rewardBalance = await web3.eth.getBalance(rewardAddress);
            rewardBalance = web3.utils.fromWei(rewardBalance, 'ether');
            dispatch(setRewardBalance(rewardBalance));
          }

          let premiumRewardAddress = await props.fatTokenContract?.methods?._premiumRewardAddress().call();
          if(premiumRewardAddress != undefined) {
            setPremiumRewardAddress(premiumRewardAddress);
            let premiumRewardBalance = await web3.eth.getBalance(premiumRewardAddress);
            premiumRewardBalance = web3.utils.fromWei(premiumRewardBalance, 'ether');
            dispatch(setPremiumRewardBalance(premiumRewardBalance));
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
        <h2 className="card-title">FatToken Stats</h2>
        {
          connected ?
            <div className="flex flex-col">
              <div>Pair Address:</div> 
              <div className="self-end mb-11">{ pair }</div> 
              <div>Token Threshold:</div> 
              <div className="self-end mb-11">{ tokenThreshold } FAT20</div> 
              <div>Reward Address:</div> 
              <div className="self-end mb-11">{ rewardAddress }</div> 
              <div>Premium Reward Address:</div> 
              <div className="self-end mb-11">{ premiumRewardAddress }</div> 
              <div>Reward Disbributor Balance:</div> 
              <div className="self-end mb-11">{ rewardBalance } ETH</div> 
              <div>Premium Reward Disbributor Balance:</div> 
              <div className="self-end mb-11">{ premiumRewardBalance } ETH</div> 
              <div>Operation Fee:</div> 
              <div className="self-end mb-10">{ operationFee }</div> 
              <div>Reward Fee:</div> 
              <div className="self-end mb-10">{ rewardFee }</div> 
              <div>Premium Reward Fee:</div> 
              <div className="self-end mb-10">{ premiumRewardFee }</div> 
              <div>Liquidity Fee:</div> 
              <div className="self-end mb-10">{ liquidityFee }</div> 
              <div>Locked Count:</div> 
              <div className="self-end mb-10">{ lockCount }</div> 
              <div>Protected Count:</div> 
              <div className="self-end mb-10">{ protectedCount }</div> 
              <div>Blacklisted Count:</div> 
              <div className="self-end mb-10">{ blacklistedCount }</div> 
            </div>
          : 
            "Please connect metamask first"
        }
      </div>
    </div>
  )
}

export default Stats;