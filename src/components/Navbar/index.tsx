import { useState } from 'react'
import Link from 'next/link'

import { NavLink, NavLinkComponent } from './NavLink'
import Hamburger from './Hamburger'
import ConnectWallet from './ConnectWallet'
import EthBalance from './EthBalance';

const NavBar = (props: any) => {
  const [active, setActive] = useState(false)

  const handleBurgerClick = () => {
    setActive(!active)
  }

  const handleConnect = () => {
    console.log('connect wallet')
  }

  return (
    <div className="navbar bg-gray-900 mb-2 shadow-lg text-white mb-0">
      <div className="flex-none px-2 mx-2">
        <NavLinkComponent href="/">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold">FatToken Test UI</span>
          </div>
        </NavLinkComponent>
      </div>
      <div className="flex-1 px-2 mx-2">
        <div className="items-stretch hidden lg:flex"></div>
      </div>
      <EthBalance />
      <ConnectWallet />
      {/* <Hamburger handleClick={handleBurgerClick} /> */}
    </div>
  )
}

export default NavBar
