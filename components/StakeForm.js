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

  let depositOptions = {
    abi: stakingMonitorAbi,
    contractAddress: stakingMonitorAddress,
    functionName: "deposit",
  };

  async function handleDepositSubmit(data) {
    depositOptions.msgValue = ethers.utils
      .parseUnits(data.data[0].inputResult)
      .toString();
    console.log("staking...");
    const tx = await runContractFunction({
      params: depositOptions,
      onError: (error) => console.log(error),
    });
    console.log(tx);
    await tx.wait(1);
    console.log("staked");
  }

  return (
    <div>
      <Form
        onSubmit={handleDepositSubmit}
        data={[
          {
            inputWidth: "50%",
            name: "Amount to deposit (in ETH)",
            type: "number",
            value: "",
            key: "amountToDeposit",
          },
        ]}
        title="Deposit"
      ></Form>
    </div>
  );
}
