import Header from "../components/Header";
import StakeDetails from "../components/StakeDetails";
import StakeForm from "../components/StakeForm";
import OrderDetails from "../components/OrderDetails";
import OrderForm from "../components/OrderForm";
import { useChain } from "react-moralis";

export default function Home() {
  const { switchNetwork, chainId, chain, account } = useChain();
  return (
    <div className="">
      <Header />
      <div className="grid grid-cols-2 gap-10 p-10">
        <div>
          <StakeDetails />
          <StakeForm />
        </div>
        <div>
          <OrderDetails />
          <OrderForm />
        </div>
      </div>
    </div>
  );
}
