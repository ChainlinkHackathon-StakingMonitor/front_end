import { ConnectButton } from "web3uikit"
import { useChain, useMoralis } from "react-moralis"
import Image from "next/image"
import Select from "./Select"

export default function Header() {
  const { switchNetwork } = useChain()

  const { network } = useMoralis()

  return (
    <nav className="flex flex-row justify-between p-5 pr-2">
      <h1 className="pl-3">
        <Image alt="logo" src="/logo.png" height="50px" width="250px" />
      </h1>
      <div className="flex flex-col items-center px-4 py-2 ml-auto sm:flex-row">
        <Select onChange={(e) => switchNetwork(e.value)} />
        <ConnectButton moralisAuth={false}></ConnectButton>
      </div>
    </nav>
  )
}
