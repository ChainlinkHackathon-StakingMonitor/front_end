// staking abi
// staking address
// how much they want to stake
// approve the reward token

import { useState } from "react"

import { ethers } from "ethers"
import { useWeb3Contract } from "react-moralis"
import { Input, Button, Select } from "web3uikit"
import InputRange from "react-input-range"
import { stakingMonitorAbi, stakingMonitorAddress } from "../constants"
import "react-input-range/lib/css/index.css"

export default function StakeForm() {
  const [transactionLoading, setTransactionLoading] = useState(false)
  const [sellValue, setSellValue] = useState(3000)

  const { runContractFunction } = useWeb3Contract()

  const orderOptions = {
    abi: stakingMonitorAbi,
    contractAddress: stakingMonitorAddress,
    functionName: "updateOrder",
  }

  async function handleOrderSubmit(data) {
    orderOptions.msgValue = ethers.utils
      .parseUnits(data.data[0].inputResult)
      .toString()
    console.log("staking...")
    const tx = await runContractFunction({
      params: orderOptions,
      onError: (error) => console.log(error),
    })
    console.log(tx)
    await tx.wait(1)
    console.log("staked")
  }

  function handleSellValue(e) {
    setSellValue(e.target.value)
  }

  console.log({ sellValue })

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-500">Current Order</h2>

      <form className="my-4" onSubmit={handleOrderSubmit}>
        {/* <p></p> */}
        <div className="relative my-4">
          <Input
            style={{
              marginTop: "30px",
              marginBottom: "30px",
            }}
            width="100%"
            label="Sell (amount of ETH)"
            type="number"
            // min="0.01"
            step=".01"
            required
          />
        </div>
        <div className="relative my-6">
          <h3 className="text-lg text-gray-600">Sell when price reaches:</h3>
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
            min="3000"
            max="4000"
            required
          />
          <p className="font-semibold text-center">{sellValue} USD</p>
        </div>
        <div className="relative my-6">
          <h3 className="my-4 text-lg text-gray-600">Sale Frequency:</h3>
          <Select
            label="Every"
            defaultOptionIndex={0}
            options={[
              {
                id: "day",
                label: "Day",
              },
              {
                id: "week",
                label: "Week",
              },
              {
                id: "month",
                label: "Month",
              },
            ]}
            style={{
              // marginTop: "30px",
              marginBottom: "16px",
              outline: 0,
            }}
            width="100%"
          />
        </div>
        <Button
          isFullWidth={true}
          disabled={transactionLoading}
          type="submit"
          icon="usdc"
          size="large"
          text="Set Sell Order"
        />
      </form>
    </div>
  )
}
