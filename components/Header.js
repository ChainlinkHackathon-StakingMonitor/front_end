import { utils } from "ethers"

import { ConnectButton } from "web3uikit"
import { useChain } from "react-moralis"
import Select from "./Select"

export default function Header() {
  const { switchNetwork } = useChain()

  return (
    <nav className="flex flex-row items-center justify-between p-5 pr-2">
      <h1 className="pl-3">
        <picture className="w-[250px] h-[50px] min-h-[50px]">
          <source
            media="(min-width: 570px)"
            height="50px"
            width="250px"
            srcSet="/logo.png"
          />
          <source
            media="(max-width: 570px)"
            className="w-[80px]"
            srcSet="/logo-sm.png"
          />
          <img src="logo-sm.png" alt="logo" className="xs:w-[250px] w-[80px]" />
        </picture>
      </h1>
      <div className="flex flex-col items-center px-4 py-2 ml-auto space-y-3 sm:space-y-0 sm:flex-row">
        <Select onChange={(e) => switchNetwork(utils.hexValue(e.value))} />
        <ConnectButton moralisAuth={false}></ConnectButton>
      </div>
    </nav>
  )
}
