/* eslint-disable react/no-unescaped-entities */
import { useMoralis } from "react-moralis"
import Header from "../components/Header"
import History from "../components/History"
import StakeDetails from "../components/StakeDetails"
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
        <div className="p-10 text-2xl font-semibold text-white">
          Please connect your wallet to continue
        </div>
      </>
    )
  }

  return (
    <div className="">
      <Header />
      {supportedChains.includes(userChainId) ? (
        <div className="block gap-10 p-5 md:grid md:grid-cols-2">
          <div className="p-10 mb-8 bg-white md:mb-0 rounded-xl opacity-90">
            <StakeDetails />
            {/* <StakeForm /> */}
          </div>
          <div className="p-10 mb-8 bg-white md:mb-0 rounded-xl opacity-90">
            {/* <OrderDetails /> */}
            <OrderForm />
          </div>
          <div className="col-span-2 p-10 bg-white rounded-xl opacity-90">
            {/* <OrderDetails /> */}
            <History />
          </div>
          <div className="col-span-2 p-10 mb-8 bg-white md:mb-0 rounded-xl opacity-90">
            <h2 className="mb-4 text-2xl font-semibold text-center text-gray-500">
              About <i>The Monitor</i>
            </h2>
            <hr className="mb-4" />
            <p>
              <i>The Monitor</i> keeps an eye on your address to check if you
              receive any staking rewards. Deposit some ETH, set your order, and{" "}
              <i>The Monitor</i> will automatically swap a "mirror" amount of
              the staking rewards you receive for DAI (more tokens coming soon).
              This way, you can sleep easy knowing that a portion of your
              staking rewards stays tucked away in a stable coin, that you can
              withdraw from our contract whenever you want! Pretty neat isn't
              it? &nbsp;
              <i>The Monitor</i> also keeps an history of the swaps it performs
              on your behalf, to help with your bookkeeping and, God forbid, tax
              records.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-10 text-2xl font-semibold text-white">
          Unsupported Network. Please switch to one of{" "}
          {Object.values(addresses)
            .map((val) => val.name)
            .join(", ")}
        </div>
      )}
    </div>
  )
}
