import { useState, useEffect } from "react";
import { FATTOKEN_ADDRESS } from "../../abis/FatTokenAbi";
import { useSelector, useDispatch } from 'react-redux';
import web3 from "../Web3";
import { setClaimableAmount, setEthBalance, setLiquidityFee, setOperationFee, setPremiumRewardFee, setRewardFee, setTokenBalance } from "../../reducers";

const BuyToken = (props: any) => {
  const [amount, setAmount] = useState<string>("");
  const dispatch = useDispatch();
  const userAddress = useSelector((state: any) => state.main.userAddress);
  const connected = useSelector((state: any) => state.main.connected);

  const handleBtnBuyClicked = async () => {
    try {
      const ethAddress = await props.router?.methods?.WETH().call();
      await props.router?.methods?.swapExactETHForTokensSupportingFeeOnTransferTokens(
        0,
        [ethAddress, FATTOKEN_ADDRESS],
        userAddress,
        Date.now()
      ).send({
        from: userAddress,
        value: web3.utils.toWei(amount)
      });
      handleBuyTokenSucceeded();
      alert('Buy Token Success');
    }catch(error: any) {
      console.log(error);
    }
  }

  const handleBuyTokenSucceeded = async () => {
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
        <h2 className="card-title">Buy Token here</h2>
        <input type="text" placeholder="Input ETH amount" className="input input-bordered w-full" onChange={handleInputAmountChanged} />
        <div className="card-actions justify-end">
          <button className="btn btn-primary" onClick={handleBtnBuyClicked} disabled={!connected}>Buy</button>
        </div>
      </div>
    </div>
  )
}

export default BuyToken;