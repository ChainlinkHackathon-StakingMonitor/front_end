// how many in wallet
// how many are staked
// how many tokens were earned

import { useMoralis, useWeb3Contract } from "react-moralis";
import { stakingMonitorAbi, stakingMonitorAddress } from "../constants";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function StakeDetails() {
  const { account, isWeb3Enabled } = useMoralis();

  useEffect(() => {
    if (isWeb3Enabled && account) {
      console.log("ready");
      updateUiValues();
    }
  }, [account, isWeb3Enabled]);

  async function updateUiValues() {
    // update values
  }

  return <div>Order</div>;
}
