// how many in wallet
// how many are staked
// how many tokens were earned

import { useMoralis, useWeb3Contract } from "react-moralis";
import { stakingMonitorAbi, stakingMonitorAddress } from "../constants";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function StakeDetails() {
  const { account, isWeb3Enabled } = useMoralis();
  const [stakedBalance, setStakedBalance] = useState("0");

  const { runContractFunction: getStakedBalance } = useWeb3Contract({
    abi: stakingMonitorAbi,
    contractAddress: stakingMonitorAddress,
    functionName: "getBalance",
    params: {
      account: account,
    },
  });

  useEffect(() => {
    if (isWeb3Enabled && account) {
      console.log("ready");
      updateUiValues();
    }
  }, [account, isWeb3Enabled]);

  async function updateUiValues() {
    const balanceFromContract = (
      await getStakedBalance({ onError: (error) => console.log(error) })
    ).toString();
    const formattedStakedBalanceFromContract = ethers.utils.formatUnits(
      balanceFromContract,
      "ether"
    );
    setStakedBalance(formattedStakedBalanceFromContract);
  }

  return <div>Your Balance is {stakedBalance}</div>;
}
