// how many in wallet
// how many are staked
// how many tokens were earned

import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect } from "react"

export default function StakeDetails() {
  const { account, isWeb3Enabled } = useMoralis()

  async function updateUiValues() {
    // update values
  }

  useEffect(() => {
    if (isWeb3Enabled && account) {
      console.log("ready")
      updateUiValues()
    }
  }, [account, isWeb3Enabled])

  return <div>Order</div>
}
