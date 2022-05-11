import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { FATTOKEN_ADDRESS } from "../../abis/FatTokenAbi";
import { ROUTER_ADDRESS } from '../../abis/RouterAbi';
import { setApproved, setClaimableAmount, setEthBalance, setLiquidityFee, setOperationFee, setPremiumRewardFee, setRewardFee, setTokenBalance, setTotalClaimed } from "../../reducers";
import web3 from "../Web3";

const AddLiquidity = (props: any) => {
  const dispatch = useDispatch();
  const [tokenAmount, setTokenAmount] = useState<string>("");
  const [ethAmount, setEthAmount] = useState<string>("");

  const userAddress = useSelector((state: any) => state.main.userAddress);
  const connected = useSelector((state: any) => state.main.connected);
  const approved = useSelector((state: any) => state.main.approved);

  useEffect(() => {
    const work = async () => {
      if(userAddress) {
        let balance = await props.fatTokenContract?.methods?.allowance(userAddress, ROUTER_ADDRESS).call();
        if(balance > 0) 
          dispatch(setApproved(true));
      } 
    }
    work();
  }, [userAddress, dispatch, props]);

  const handleBtnAddClicked = async () => {
    try {
      await props.router?.methods?.addLiquidityETH(
        FATTOKEN_ADDRESS,
        web3.utils.toWei(tokenAmount),
        0,
        0,
        userAddress,
        Date.now()
      ).send({
        from: userAddress,
        value: web3.utils.toWei(ethAmount)
      });
      handleAddLiquiditySucceeded();
      alert('Add Liquidity Success');
    } catch(e: any) {
      console.log(e);
    }
  }

  const handleAddLiquiditySucceeded = async () => {
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

  const handleBtnApproveClicked = async () => {
    try {
      await props.fatTokenContract.methods.approve(ROUTER_ADDRESS, web3.utils.toWei("1000000000")).send({
        from: userAddress
      });
      dispatch(setApproved(true));
    }catch(e: any) {
      console.log(e);
    }
  }

  const handleInputEthAmountChanged = (event: any) => {
    setEthAmount(event.target.value);
  }

  const handleInputTokenAmountChanged = (event: any) => {
    setTokenAmount(event.target.value);
  }

  return (
    <div className="card w-full bg-base-100 shadow-xl my-5">
      <div className="card-body">
        <h2 className="card-title">Add Liquidity</h2>
        {
          approved ? 
            <div>
              <input type="text" placeholder="Token Amount here" className="input input-bordered w-full mb-3" onChange={handleInputTokenAmountChanged} />
              <input type="text" placeholder="ETH Amount here" className="input input-bordered w-full" onChange={handleInputEthAmountChanged} />
            </div>
          : ""
        }
        <div className="card-actions justify-end">
          {
            approved ? 
            <button className="btn btn-primary" onClick={handleBtnAddClicked} disabled={!connected}>Add Liquidity</button>
            : 
            <button className="btn btn-primary" onClick={handleBtnApproveClicked} disabled={!connected}>Approve</button>
          }
        </div>
      </div>
    </div>
  )
}

export default AddLiquidity;