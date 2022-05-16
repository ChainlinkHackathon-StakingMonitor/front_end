import { useMoralis } from "react-moralis"
import Header from "../components/Header"
import History from "../components/History"
import StakeDetails from "../components/StakeDetails"
// import StakeForm from "../components/StakeForm"
// import OrderDetails from "../components/OrderDetails"
import OrderForm from "../components/OrderForm"
import { addresses } from "../constants"

export default function Home() {
  // const { switchNetwork, chainId, chain, account } = useChain()
  const { isWeb3Enabled, chainId } = useMoralis()
  const userChainId = parseInt(chainId).toString()
  const supportedChains = Object.keys(addresses)

  if (!isWeb3Enabled) {
    return (
      <>
        <Header />
        <div className="p-10 text-2xl font-semibold">
          Please connect your wallet to continue
        </div>
      </>
    )
  }

  return (
    <div className="">
      <Header />
      {supportedChains.includes(userChainId) ? (
        <div className="grid grid-cols-1 gap-10 p-10 md:grid-cols-2">
          <div className="p-10 bg-white rounded-xl opacity-90">
            <StakeDetails />
            {/* <StakeForm /> */}
          </div>
          <div className="p-10 bg-white rounded-xl opacity-90">
            {/* <OrderDetails /> */}
            <OrderForm />
          </div>
          <div className="p-10 bg-white rounded-xl opacity-90 col-span-2">
            {/* <OrderDetails /> */}
            <History />
          </div>
        </div>
      ) : (
        <div className="p-10 text-2xl font-semibold">
          Unsupported Network. Please switch to one of{" "}
          {Object.values(addresses)
            .map((val) => val.name)
            .join(", ")}
        </div>
      )}
    </div>
  )
}
