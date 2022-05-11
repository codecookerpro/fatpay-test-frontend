import { useState, useEffect } from "react";
import Web3 from 'web3';

import TotalClaimed from "./TotalClaimed";
import Claim from "./Claim";
import TokenBalance from "./TokenBalance";
import BuyToken from "./BuyToken";
import SellToken from "./SellToken";
import AddLiquidity from "./AddLiquidity";
import TokenLock from "./LockToken";
import Stats from "./Stats"

const FatToken = (props: any) => {

  return (
    <div className="flex flex-row flex-grow space-x-4">
      <div className="basis-1/4">
        <TokenBalance fatTokenContract = {props.fatTokenContract}/>
        <BuyToken fatTokenContract = {props.fatTokenContract} router={props.router} />
        <SellToken fatTokenContract = {props.fatTokenContract} router={props.router} />
        <AddLiquidity fatTokenContract = {props.fatTokenContract} router={props.router} />
      </div>
      <div className="basis-2/4">
        <Claim fatTokenContract = {props.fatTokenContract} />
        <TotalClaimed fatTokenContract = {props.fatTokenContract} router={props.router} />
        <TokenLock fatTokenContract = {props.fatTokenContract} />
      </div>
      <div className="basis-1/4">
        <Stats fatTokenContract = {props.fatTokenContract} />
      </div>
    </div >
  )
}

export default FatToken;