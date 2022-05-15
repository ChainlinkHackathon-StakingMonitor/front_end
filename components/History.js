// how many in wallet
// how many are staked
// how many tokens were earned

import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect } from "react"

export default function History() {
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

  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold text-center text-gray-500">
        History
      </h2>
      <hr className="mb-4" />
    </div>
  )
}
