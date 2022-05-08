// staking abi
// staking address
// how much they want to stake
// approve the reward token
import { ethers } from "ethers";
import { useWeb3Contract } from "react-moralis";
import { Form } from "web3uikit";
import { stakingMonitorAbi, stakingMonitorAddress } from "../constants";

export default function StakeForm() {
  const { runContractFunction } = useWeb3Contract();

  let orderOptions = {
    abi: stakingMonitorAbi,
    contractAddress: stakingMonitorAddress,
    functionName: "updateOrder",
  };

  async function handleOrderSubmit(data) {
    depositOptions.msgValue = ethers.utils
      .parseUnits(data.data[0].inputResult)
      .toString();
    console.log("staking...");
    const tx = await runContractFunction({
      params: orderOptions,
      onError: (error) => console.log(error),
    });
    console.log(tx);
    await tx.wait(1);
    console.log("staked");
  }

  return (
    <div>
      <Form
        onSubmit={handleOrderSubmit}
        data={[
          {
            inputWidth: "100%",
            name: "Price Limit (in dollars)",
            type: "number",
            value: "",
            key: "priceLimit",
          },
        ]}
        title=""
      ></Form>
    </div>
  );
}
