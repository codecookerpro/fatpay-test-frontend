import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setClaimableAmount, setEthBalance, setLiquidityFee, setOperationFee, setPremiumRewardFee, setRewardFee, setTokenBalance, setTotalClaimed } from "../../reducers";

import web3 from "../Web3";

const Claim = (props: any) => {
  const dispatch = useDispatch();
  const claimableAmount = useSelector((state: any) => state.main.claimableAmount);
  const userAddress = useSelector((state: any) => state.main.userAddress);
  const connected = useSelector((state: any) => state.main.connected);
  const [reinvested, setReinvested] = useState(false);

  useEffect(() => {
    const work = async () => {
      if(userAddress) {
        try {
          // await props.fatTokenContract?.methods?.setTokenThreshold(web3.utils.toWei("2460641", 'ether')).send({
          //   from: userAddress
          // });

          let balance = await props.fatTokenContract?.methods?.getClaimableReward(userAddress).call();
          if(balance) {
            balance = web3.utils.fromWei(balance, 'ether');
            dispatch(setClaimableAmount(balance));
          }

          let reinvest = await props.fatTokenContract?.methods?.getReinvest(userAddress).call();
          if(reinvest) {
            setReinvested(reinvest);
          }
        } catch(e: any) {
          console.log(e);
        }
      }
    }
    work();
  }, [userAddress, dispatch, props]);

  const handleClaimSucceeded = async () => {
    try {
      let tokenBalance = await props.fatTokenContract?.methods?.balanceOf(userAddress).call();
      if(tokenBalance !== undefined) {
        tokenBalance = web3.utils.fromWei(tokenBalance, 'ether');
        dispatch(setTokenBalance(tokenBalance));
      }

      let claimableAmount = await props.fatTokenContract?.methods?.getClaimableReward(userAddress).call();
      if(claimableAmount !== undefined) {
        claimableAmount = web3.utils.fromWei(claimableAmount, 'ether');
        dispatch(setClaimableAmount(claimableAmount));
      }

      let ethBalance = await web3.eth.getBalance(userAddress);
      if(ethBalance !== undefined) {
        ethBalance = web3.utils.fromWei(ethBalance, 'ether');
        dispatch(setEthBalance(ethBalance));
      }
      
      let operation = await props.fatTokenContract?.methods?._operationFeeAmount().call();
      if(operation !== undefined) {
        operation = web3.utils.fromWei(operation, 'ether');
        dispatch(setOperationFee(operation));
      }

      let reward = await props.fatTokenContract?.methods?._rewardFeeAmount().call();
      if(reward !== undefined) {
        reward = web3.utils.fromWei(reward, 'ether');
        dispatch(setRewardFee(reward));
      } 

      let premiumReward = await props.fatTokenContract?.methods?._premiumRewardFeeAmount().call();
      if(premiumReward !== undefined) {
        premiumReward = web3.utils.fromWei(premiumReward, 'ether');
        dispatch(setPremiumRewardFee(premiumReward));
      }

      let liquidity = await props.fatTokenContract?.methods?._liquidityFeeAmount().call();
      if(liquidity !== undefined) {
        liquidity = web3.utils.fromWei(liquidity, 'ether');
        dispatch(setLiquidityFee(liquidity)); 
      }

      let totalClaimed = await props.fatTokenContract?.methods?.getTotalClaimed(userAddress).call();
      if(totalClaimed != undefined) {
        totalClaimed = web3.utils.fromWei(totalClaimed, 'ether');
        dispatch(setTotalClaimed(totalClaimed));
      }

    }catch(e: any) {
      console.log(e);
    }
  }

  const handleBtnClaimClicked = () => {
    const work = async  () => {
      try {
        await props.fatTokenContract?.methods?.claimRewards().send({
          from: userAddress
        });
        handleClaimSucceeded();
        alert('Claim Success');
      } catch(e: any) {
        console.log(e);
      }
    }
    work();
  }

  const handleReinvestClicked = async () => {
    try {
      await props.fatTokenContract?.methods?.setReinvest(!reinvested).send({
        from: userAddress
      });
      alert('Set Reinvest Success');
      setReinvested(!reinvested);
    } catch(e) {
      console.log(e);
    }
  }

  return (
    <div className="card w-full bg-base-100 shadow-xl my-5">
      <div className="card-body">
        <h2 className="card-title">Claimable Rewards</h2>
        <h3 className="card-title">
          { connected ? claimableAmount + " ETH" : "Please connect metamask first" }
        </h3>
        <div className="card-actions justify-end">
          <button className="btn btn-primary" onClick={handleBtnClaimClicked} disabled={!connected}>Claim</button>
          <button className="btn btn-primary" onClick={handleReinvestClicked} disabled={!connected}>
            {
              reinvested ? "Unset Reinvest" : "Set Reinvest"
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default Claim;