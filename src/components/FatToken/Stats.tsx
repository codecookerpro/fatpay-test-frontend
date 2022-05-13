import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';

import web3 from "../Web3";
import { setOperationFee, setRewardFee, setPremiumRewardFee, setLiquidityFee, setRewardBalance, setPremiumRewardBalance } from "../../reducers";

const Stats = (props: any) => {
  const dispatch = useDispatch();
  const userAddress = useSelector((state: any) => state.main.userAddress);
  const connected = useSelector((state: any) => state.main.connected);

  const operationFee = useSelector((state: any) => state.main.operationFee);
  const rewardFee = useSelector((state: any) => state.main.rewardFee);
  const premiumRewardFee = useSelector((state: any) => state.main.premiumRewardFee);
  const liquidityFee = useSelector((state: any) => state.main.liquidityFee);
  const rewardBalance = useSelector((state: any) => state.main.rewardBalance);
  const premiumRewardBalance = useSelector((state: any) => state.main.premiumRewardBalance);

  const [tokenThreshold, setTokenThreshold] = useState("0");
  const [pair, setPair] = useState("0");
  const [rewardAddress, setRewardAddress] = useState("");

  useEffect(() => {
    const work = async () => {
      if(userAddress) {
        
        try {
          let operation = await props.fatTokenContract?.methods?._operationFeeAmount().call();
          if(operation) {
            operation = web3.utils.fromWei(operation, 'ether');
            dispatch(setOperationFee(operation));
          }

          let reward = await props.fatTokenContract?.methods?._rewardFeeAmount().call();
          if(reward) {
            reward = web3.utils.fromWei(reward, 'ether');
            dispatch(setRewardFee(reward));
          } 

          let premiumReward = await props.fatTokenContract?.methods?._premiumRewardFeeAmount().call();
          if(premiumReward) {
            premiumReward = web3.utils.fromWei(premiumReward, 'ether');
            dispatch(setPremiumRewardFee(premiumReward));
          }

          let liquidity = await props.fatTokenContract?.methods?._liquidityFeeAmount().call();
          if(liquidity) {
            liquidity = web3.utils.fromWei(liquidity, 'ether');
            dispatch(setLiquidityFee(liquidity)); 
          }

          let threshold = await props.fatTokenContract?.methods?._tokenThreshold().call();
          if(threshold) {
            threshold = web3.utils.fromWei(threshold, 'ether');
            setTokenThreshold(threshold); 
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
              <div>Reward Disbributor Balance:</div> 
              <div className="self-end mb-11">{ rewardBalance } ETH</div> 
              <div>Premium Reward Disbributor Balance:</div> 
              <div className="self-end mb-11">{ premiumRewardBalance } ETH</div> 
              <div>OperationFeeAmount:</div> 
              <div className="self-end mb-10">{ operationFee } FAT20</div> 
              <div>RewardFeeAmount:</div> 
              <div className="self-end mb-10">{ rewardFee } FAT20</div> 
              <div>PremiumRewardFeeAmount:</div> 
              <div className="self-end mb-10">{ premiumRewardFee } FAT20</div> 
              <div>LiquidiyFeeAmount:</div> 
              <div className="self-end mb-10">{ liquidityFee } FAT20</div> 
            </div>
          : 
            "Please connect metamask first"
        }
      </div>
    </div>
  )
}

export default Stats;