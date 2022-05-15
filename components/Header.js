import { ConnectButton } from "web3uikit"
// import Image from "next/image"

export default function Header() {
  return (
    <nav className="flex flex-row items-center justify-center p-5 pr-2">
      <h1 className="pl-3">
        <img alt="logo" src="/logo.png" height="35px" width="70px" />
      </h1>
      <div className="px-4 py-2 ml-auto">
        <ConnectButton moralisAuth={false}></ConnectButton>
      </div>
    </nav>
  )
}
