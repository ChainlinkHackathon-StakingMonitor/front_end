// staking abi
// staking address
// how much they want to stake
// approve the reward token
import { ethers } from "ethers";
import { useWeb3Contract } from "react-moralis";
import { Form } from "web3uikit";
import { stakingMonitorAbi, stakingAddress } from "../constants";

export default function StakeForm() {
  const { runContractFunction } = useWeb3Contract();

  let stakeOptions = {
    abi: stakingMonitorAbi,
    contractAddress: stakingAddress,
    functionName: "approve",
  };

  async function handleStakeSubmit() {
    const amountToApprove = data.data[0].inputResult;
    approveOptions.params = {
      amount: ethers.utils.parseUnits(amountToApprove, "ethers").toString(),
      spender: stakingAddress,
    };
    console.log("approving...");
    const tx = await runContractFunction({
      params: approveOptions,
      onError: (error) => console.log(error),
      onSuccess: () => {
        handleApproveSuccess(approveOptions.params.amount);
      },
    });
  }

  async function handleApproveSuccess(amountToStakeFormatted) {
    stakeOptions.params = {
      amount: amountToStakeFormat,
    };
    console.log("staking...");
    const tx = await runContractFunction({
      params: stakeOptions,
      onError: (error) => console.log(error),
    });
    await tx.wait(1);
    console.log("staked");
  }

  return (
    <div>
      <Form
        onSubmit={handleStakeSubmit}
        data={[
          {
            inputWidth: "50%",
            name: "Amount to stake (in ETH)",
            type: "number",
            value: "",
            key: "amountToStake",
          },
        ]}
        title="Let's stake"
      ></Form>
    </div>
  );
}
