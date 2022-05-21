// how many in wallet
// how many are staked
// how many tokens were earned

import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect } from "react"
import { addresses, stakingMonitorAbi } from "../constants"

export default function History() {
  const { account, isWeb3Enabled, chainId } = useMoralis()

  const { address, currency } = addresses[parseInt(chainId).toString()]

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
      <table className="table-auto w-max">
        <thead className="bg-gray-50 ">
          <tr>
            <th className="px-6 py-2 text-xs text-gray-500">Date/Time</th>
            <th className="px-6 py-2 text-xs text-gray-500">
              Total Stake Reward
            </th>
            <th className="px-6 py-2 text-xs text-gray-500">
              Percentage Swapped
            </th>
            <th className="px-6 py-2 text-xs text-gray-500">
              {currency} Price
            </th>
            <th className="px-6 py-2 text-xs text-gray-500">Value Swapped</th>
            <th className="px-6 py-2 text-xs text-gray-500">DAI Amount</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          <tr className="whitespace-nowrap">
            <td className="px-6 py-4 text-sm text-gray-500">2021-1-12</td>
            <td className="px-6 py-4">
              <div className="text-sm text-gray-500">0.2 {currency}</div>
            </td>
            <td className="px-6 py-4">
              <div className="text-sm text-gray-500">40%</div>
            </td>
            <td className="px-6 py-4 text-sm text-gray-500">$2500</td>
            <td className="px-6 py-4">
              <div className="text-sm text-gray-500">0.04</div>
            </td>
            <td className="px-6 py-4">
              <div className="text-sm text-gray-500">35 DAI</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
