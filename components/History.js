// how many in wallet
// how many are staked
// how many tokens were earned

import { useEffect, useState, useContext } from "react"

import { ethers } from "ethers"
import { useMoralis } from "react-moralis"
import { Checkbox, useNotification } from "web3uikit"

import fetchHistory from "../services/services"
import AppContext from "../store/AppContext"

export default function History() {
  const { account, isWeb3Enabled, chainId } = useMoralis()
  const [history, setHistory] = useState([])
  const [onlyUser, setOnlyUser] = useState(true)
  const { network } = useContext(AppContext)

  const { currency, address, name } = network

  const dispatch = useNotification()

  function handleHistoryErrorNotification(error) {
    dispatch({
      type: "error",
      message: `Error Fetching history: ${error}`,
      title: "Notification",
      position: "bottomL",
      icon: "exclamation",
    })
  }

  async function getHistory() {
    const chainInt = parseInt(chainId)
    let historyData = await fetchHistory(chainInt, address)

    if (historyData.error) {
      return handleHistoryErrorNotification(historyData.message)
    }

    if (onlyUser) {
      historyData = historyData.filter(
        (h) => h.account.toLowerCase() === account.toLowerCase()
      )
    }

    setHistory(historyData)
    return historyData
  }

  useEffect(() => {
    if (isWeb3Enabled && account && Object.keys(network).length > 0) {
      setHistory([])
      getHistory()
    }
  }, [account, isWeb3Enabled, onlyUser, network])

  return (
    <div className="overflow-x-scroll">
      <div>
        <h2 className="mb-4 text-2xl font-semibold text-center text-gray-500">
          History
        </h2>
        {/* <div className="m">
          <Checkbox
            id="test-checkbox"
            label="My History"
            name="Show user txns"
            onChange={() => setOnlyUser(!onlyUser)}
          />
        </div> */}
      </div>
      <hr className="mb-4" />
      <div className="inline-block min-w-full pt-3 overflow-hidden align-middle bg-white rounded-bl-lg rounded-br-lg shadow shadow-dashboard">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 leading-4 tracking-wider text-left text-blue-500 border-b-2 border-gray-300">
                Date/Time
              </th>
              <th className="px-6 py-3 text-sm leading-4 tracking-wider text-left text-blue-500 border-b-2 border-gray-300">
                Value Swapped
              </th>
              <th className="px-6 py-3 text-sm leading-4 tracking-wider text-left text-blue-500 border-b-2 border-gray-300">
                {currency} Price
              </th>
              <th className="px-6 py-3 text-sm leading-4 tracking-wider text-left text-blue-500 border-b-2 border-gray-300">
                Price Limit
              </th>
              <th className="px-6 py-3 text-sm leading-4 tracking-wider text-left text-blue-500 border-b-2 border-gray-300">
                DAI Amount
              </th>
              <th className="px-6 py-3 text-sm leading-4 tracking-wider text-left text-blue-500 border-b-2 border-gray-300">
                Network
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300"></th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {history.map((h, i) => {
              return (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm leading-5 text-gray-800">
                          {new Date(
                            parseInt(h.timestamp) * 1000
                          ).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                    <div className="text-sm leading-5 text-blue-900">
                      {ethers.utils.formatEther(h.totalReward)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm leading-5 text-blue-900 whitespace-no-wrap border-b border-gray-500">
                    {/* decimal 8 */}
                    {parseInt(h.ethPrice) / 1e8}
                  </td>
                  <td className="px-6 py-4 text-sm leading-5 text-blue-900 whitespace-no-wrap border-b border-gray-500">
                    {parseInt(h.priceLimit) / 1e8}
                  </td>
                  <td className="px-6 py-4 text-sm leading-5 text-blue-900 whitespace-no-wrap border-b border-gray-500">
                    {/* decimal 18 */}
                    {parseInt(h.daiReceived) / 1e18}
                  </td>
                  <td className="px-6 py-4 text-sm leading-5 text-blue-900 whitespace-no-wrap border-b border-gray-500">
                    {/* decimal 18 */}
                    {name}
                  </td>
                  <td className="px-6 py-4 text-sm leading-5 text-right whitespace-no-wrap border-b border-gray-500">
                    <a
                      href={`https://kovan.etherscan.io/tx/${h.transaction}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <button className="px-5 py-2 text-sm text-blue-500 transition duration-300 border border-blue-500 rounded hover:bg-blue-700 hover:text-white focus:outline-none">
                        View Details
                      </button>
                    </a>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="mt-4 sm:flex-1 sm:flex sm:items-center sm:justify-between work-sans">
          <div></div>
        </div>
      </div>
    </div>
  )
}
