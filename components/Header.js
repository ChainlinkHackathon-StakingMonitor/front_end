import { ConnectButton } from "web3uikit"
export default function Header() {
    return (
        <nav className="p-5 border-b-2 flex flex-row">
            <h1 className="py-4 px-5 font-bold text-3xl">Staking Monitor</h1>
            <ConnectButton moralisAuth={false}></ConnectButton>
        </nav>
    )
}
