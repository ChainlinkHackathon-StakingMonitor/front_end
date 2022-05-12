import { ConnectButton } from "web3uikit"
import Image from "next/image"

export default function Header() {
  return (
    <nav className="flex flex-row p-5">
      <h1 className="">
        <Image alt="logo" src="/logo.png" height="50px" width="250px" />
      </h1>
      <div className="px-4 py-2 ml-auto">
        <ConnectButton moralisAuth={false}></ConnectButton>
      </div>
    </nav>
  )
}
