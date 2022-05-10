import { ConnectButton } from "web3uikit"

export default function Header() {
  return (
    <nav className="flex flex-row p-5 border-b-2">
      <h1 className="px-5 py-4 text-3xl font-bold">Staking Monitor</h1>
      <div className="px-4 py-2 ml-auto">
        <ConnectButton moralisAuth={false}></ConnectButton>
      </div>
    </nav>
  )
}
