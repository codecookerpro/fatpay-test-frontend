import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { ROUTER_ADDRESS } from '../../abis/RouterAbi';
import web3 from "../Web3";
import { FATTOKEN_ADDRESS } from "../../abis/FatTokenAbi";
import { setApproved, setClaimableAmount, setEthBalance, setLiquidityFee, setOperationFee, setPremiumRewardBalance, setPremiumRewardFee, setRewardBalance, setRewardFee, setTokenBalance, setTotalClaimed } from "../../reducers";

const SellToken = (props: any) => {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState<string>("");

  const userAddress = useSelector((state: any) => state.main.userAddress);
  const connected = useSelector((state: any) => state.main.connected);
  const approved = useSelector((state: any) => state.main.approved);

  useEffect(() => {
    const work = async () => {
      if(userAddress) {
          let balance = await props.fatTokenContract?.methods?.allowance(userAddress, ROUTER_ADDRESS).call();        
          if(balance > 0) {
            dispatch(setApproved(true));
          }
      }
    }
    work();
  }, [userAddress, dispatch, props]);

  const handleBtnSellClicked = async () => {
    try{
      const ethAddress = await props.router?.methods?.WETH().call();
      await props.router?.methods?.swapExactTokensForETHSupportingFeeOnTransferTokens(
        web3.utils.toWei(amount),
        0,
        [FATTOKEN_ADDRESS, ethAddress],
        userAddress,
        Date.now()
      ).send({
        from: userAddress
      });
      handleSellTokenSucceeded();
      alert('Sell Token Success');
    } catch(e: any) {
      console.log(e);
    }
  }

  const handleSellTokenSucceeded = async () => {
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

      let rewardAddress = await props.fatTokenContract?.methods?._rewardAddress().call();
      if(rewardAddress != undefined) {
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

      let totalClaimed = await props.fatTokenContract?.methods?.getTotalClaimed(userAddress).call();
      if(totalClaimed != undefined) {
        totalClaimed = web3.utils.fromWei(totalClaimed, 'ether');
        dispatch(setTotalClaimed(totalClaimed));
      }

    }catch(e: any) {
      console.log(e);
    }
  }

  const handleBtnApproveClicked = async () => {
    try {
      await props.fatTokenContract?.methods?.approve(ROUTER_ADDRESS, web3.utils.toWei("1000000000")).send({
        from: userAddress
      });
      dispatch(setApproved(true));
    }catch(e: any) {
      console.log(e);
    }
  }

  const handleInputAmountChanged = (event: any) => {
    setAmount(event.target.value);
  }

  return (
    <div className="card w-full bg-base-100 shadow-xl my-5">
      <div className="card-body">
        <h2 className="card-title">Sell Token here</h2>
        {
          approved ? 
            <input type="text" placeholder="Input token amount" className="input input-bordered w-full" onChange={handleInputAmountChanged} />
            :
            ""
        }
        <div className="card-actions justify-end">
          {
            approved ?
              <button className="btn btn-primary" onClick={handleBtnSellClicked} disabled={!connected}>Sell</button>
            :
              <button className="btn btn-primary" onClick={handleBtnApproveClicked} disabled={!connected}>Approve</button>
          }
        </div>
      </div>
    </div>
  )
}

export default SellToken;