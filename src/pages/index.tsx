import { useState, useEffect } from 'react'

import web3 from '../components/Web3';
import NavBar from '../components/Navbar';
import FatToken from '../components/FatToken';
import { AbiItem } from 'web3-utils'
import { FATTOKEN_ADDRESS, FATTOKEN_ABI } from '../abis/FatTokenAbi';
import { ROUTER_ADDRESS, ROUTER_ABI } from '../abis/RouterAbi';

declare let window: any

const Home = () => {

  const [fatTokenContract, setFatTokenContract]: any = useState();
  const [router, setRouter]: any = useState();

  useEffect(() => {
    if (!window.ethereum) {
      console.error('Please install MetaMask')
      return
    }

    const work = async() => {
      const chainId = 97;
      if (window.ethereum.networkVersion !== chainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: web3.utils.toHex(chainId) }]
          });

          initializeContracts();
        } catch (err: any) {
          console.log(err);
        }
      } else {
        initializeContracts();
      }
    }
    work();
  }, [])

  const initializeContracts = () => {
    const fatTokenContract = new web3.eth.Contract(FATTOKEN_ABI as AbiItem[], FATTOKEN_ADDRESS);
    setFatTokenContract(fatTokenContract);

    const router = new web3.eth.Contract(ROUTER_ABI as AbiItem[], ROUTER_ADDRESS);
    setRouter(router);
  }

  return (
    <div>
      <NavBar fatTokenContract={fatTokenContract}/>
      <FatToken fatTokenContract={fatTokenContract} router={router}/>
    </div>
  )
}

export default Home;
