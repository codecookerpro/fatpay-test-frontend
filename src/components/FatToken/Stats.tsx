import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';

import web3 from "../Web3";
import { setOperationFee, setRewardFee, setPremiumRewardFee, setLiquidityFee } from "../../reducers";

const Stats = (props: any) => {
  const dispatch = useDispatch();
  const userAddress = useSelector((state: any) => state.main.userAddress);
  const connected = useSelector((state: any) => state.main.connected);

  const operationFee = useSelector((state: any) => state.main.operationFee);
  const rewardFee = useSelector((state: any) => state.main.rewardFee);
  const premiumRewardFee = useSelector((state: any) => state.main.premiumRewardFee);
  const liquidityFee = useSelector((state: any) => state.main.liquidityFee);

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