// staking abi
// staking address
// how much they want to stake
// approve the reward token

import { useContext, useEffect, useState } from "react"

import { ethers } from "ethers"

import { useSnapshot } from "valtio"

import { Input, Button, useNotification, Loading, Tooltip } from "web3uikit"
import { stakingMonitorAbi, NETWORK_CURRENCY_TICKER } from "../constants"
import AppContext from "../store/AppContext"
import { state } from "../store/store"

export default function StakeForm() {
  const { network } = useContext(AppContext)
  const snapshot = useSnapshot(state)

  const balance = snapshot.balance
  const user = snapshot.user
  console.log(user)
  // const userSellValue =

  const [sellValue, setSellValue] = useState(3000)
  const [percentageOfReward, setPercentageOfReward] = useState(40)
  const [isLoading, setIsLoading] = useState(false)

  const { address } = network

  const dispatch = useNotification()

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

  useEffect(() => {
    user.swapPercent
      ? setPercentageOfReward(user.swapPercent)
      : setPercentageOfReward(percentageOfReward)

    user.priceLimit ? setSellValue(user.priceLimit) : setSellValue(sellValue)
  }, [user.swapPercent, user.priceLimit])

  async function handleOrderSubmit(e) {
    e.preventDefault()
    console.log
    if (parseFloat(balance) <= 0) {
      handleOrderNotification(
        "error",
        "You need to make a deposit to set an order"
      )
      return
    }

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
      <h2 className="mb-4 text-2xl font-semibold text-center text-gray-500">
        Order Settings
      </h2>
      <hr className="mb-4" />
      <form className="my-4" onSubmit={handleOrderSubmit}>
        {/* <p></p> */}
        {user.enoughBalanceToSwap === true && (
          <div
            class="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
            role="alert"
          >
            <p class="font-bold">Warning</p>

            <p>
              You do not have enough deposit balance to performs the next swap.
              Please deposit {user.balanceRequired} at your earliest
              convenience.
            </p>
          </div>
        )}
        <div className="relative my-6">
          <p>Swap:</p>
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
            {percentageOfReward}% of reward
          </p>
        </div>

        <div className="relative my-6">
          <p>when {NETWORK_CURRENCY_TICKER} price is above:</p>
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
            min="1000"
            max="4000"
            required
          />
          <p className="font-semibold text-center">{sellValue} USD</p>
        </div>
        <Tooltip
          content="You need to make a deposit to set an order"
          position="top"
        >
          <Button
            isFullWidth={true}
            disabled={isLoading || !user.created}
            type="submit"
            icon="usdc"
            // size="large"
            text={
              !isLoading ? "Set Swap Order" : <Loading spinnerColor="#2e7daf" />
            }
          />
        </Tooltip>
      </form>
    </div>
  )
}
