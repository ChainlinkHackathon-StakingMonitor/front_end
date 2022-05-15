// staking abi
// staking address
// how much they want to stake
// approve the reward token

import { useState } from "react"

import { ethers } from "ethers"
import { useMoralis } from "react-moralis"
import { Input, Button, useNotification, Loading } from "web3uikit"
import {
  stakingMonitorAbi,
  NETWORK_CURRENCY_TICKER,
  addresses,
} from "../constants"

export default function StakeForm() {
  const { chainId, account } = useMoralis()
  const [sellValue, setSellValue] = useState(3000)
  const [percentageOfReward, setPercentageOfReward] = useState(40)
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useNotification()
  const { address } = addresses[parseInt(chainId).toString()]

  function handleOrderNotification(status, error = null) {
    dispatch({
      type: status === "success" ? "success" : "error",
      message: `Order Update ${
        status === "success" ? "Successful" : `Failed: ${error}`
      }`,
      title: "Transaction Notification",
      position: "topL",
      icon: "bell",
    })
  }

  async function handleOrderSubmit(e) {
    e.preventDefault()

    let status
    let error

    setIsLoading(true)

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    const smContract = new ethers.Contract(address, stakingMonitorAbi, signer)

    try {
      const orderTx = await smContract.setOrder(
        sellValue.toString(),
        percentageOfReward.toString(),
        {
          gasLimit: 500000,
        }
      )

      await orderTx.wait(1)

      status = "success"

      handleOrderNotification(status, error)
      setIsLoading(false)
    } catch (orderError) {
      console.log(orderError)

      status = "error"
      error = orderError.message

      handleOrderNotification(status, error)
      setIsLoading(false)
    }
  }

  function handleSellValue(e) {
    setSellValue(e.target.value)
  }

  function handlePercentageOfReward(e) {
    setPercentageOfReward(e.target.value)
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-500">Order Settings</h2>
      <form className="my-4" onSubmit={handleOrderSubmit}>
        {/* <p></p> */}
        <div className="relative my-6">
          <h3 className="text-lg text-gray-600">Swap:</h3>
          <Input
            style={{
              // marginTop: "30px",
              // marginBottom: "30px",
              outline: 0,
            }}
            width="100%"
            value={percentageOfReward}
            onChange={handlePercentageOfReward}
            type="range"
            min="5"
            max="100"
            required
          />
          <p className="font-semibold text-center">
            {percentageOfReward} % of reward
          </p>
        </div>

        <div className="relative my-6">
          <h3 className="text-lg text-gray-600">
            when {NETWORK_CURRENCY_TICKER} price is above:
          </h3>
          <Input
            style={{
              // marginTop: "30px",
              // marginBottom: "30px",
              outline: 0,
            }}
            width="100%"
            value={sellValue}
            onChange={handleSellValue}
            // label="Sell when price of ETH reaches"
            type="range"
            min="2000"
            max="4000"
            required
          />
          <p className="font-semibold text-center">{sellValue} USD</p>
        </div>
        <Button
          isFullWidth={true}
          disabled={isLoading}
          type="submit"
          icon="usdc"
          size="large"
          text={
            !isLoading ? "Set Swap Order" : <Loading spinnerColor="#2e7daf" />
          }
        />
      </form>
    </div>
  )
}
