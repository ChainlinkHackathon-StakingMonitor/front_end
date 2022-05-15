// staking abi
// staking address
// how much they want to stake
// approve the reward token

import { useState } from "react"

import { ethers } from "ethers"
import { useWeb3Contract } from "react-moralis"
import { Input, Button, Select, Radios } from "web3uikit"
import InputRange from "react-input-range"
import {
  stakingMonitorAbi,
  stakingMonitorAddress,
  NETWORK_CURRENCY_TICKER,
} from "../constants"
import "react-input-range/lib/css/index.css"

export default function StakeForm() {
  const [transactionLoading, setTransactionLoading] = useState(false)
  const [sellValue, setSellValue] = useState(3000)
  const [percentageOfReward, setPercentageOfReward] = useState(40)

  const { runContractFunction } = useWeb3Contract()

  const orderOptions = {
    abi: stakingMonitorAbi,
    contractAddress: stakingMonitorAddress,
    functionName: "updateOrder",
  }

  async function handleOrderSubmit(e) {
    e.preventDefault()
    //console.log(data)
    //orderOptions.msgValue = ethers.utils
    //  .parseUnits(data.data[0].inputResult)
    //  .toString()
    //console.log("staking...")
    //const tx = await runContractFunction({
    //  params: orderOptions,
    //  onError: (error) => console.log(error),
    //})
    //console.log(tx)
    //await tx.wait(1)
    //console.log("staked")
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
            // label="Sell when price of ETH reaches"
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
          disabled={transactionLoading}
          type="submit"
          icon="usdc"
          size="large"
          text="Set Swap Order"
        />
      </form>
    </div>
  )
}
