import { useChain } from "react-moralis"
import Header from "../components/Header"
import StakeDetails from "../components/StakeDetails"
// import StakeForm from "../components/StakeForm"
// import OrderDetails from "../components/OrderDetails"
import OrderForm from "../components/OrderForm"

export default function Home() {
  // const { switchNetwork, chainId, chain, account } = useChain()
  return (
    <div className="">
      <Header />
      <div className="grid grid-cols-1 gap-10 p-10 md:grid-cols-2">
        <div className="bg-white p-10 rounded-xl opacity-90">
          <StakeDetails />
          {/* <StakeForm /> */}
        </div>
        <div className="bg-white p-10 rounded-xl opacity-90">
          {/* <OrderDetails /> */}
          <OrderForm />
        </div>
      </div>
    </div>
  )
}
