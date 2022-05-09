// how many in wallet
// how many are staked
// how many tokens were earned

import { useState, useEffect } from "react"

import { useMoralis, useWeb3Contract } from "react-moralis"
import { useNotification } from "web3uikit"
import { stakingMonitorAbi, stakingMonitorAddress } from "../constants"
import { ethers } from "ethers"
import StakeForm from "./StakeForm"

export default function StakeDetails() {
  const { account, isWeb3Enabled } = useMoralis()
  const [stakedBalance, setStakedBalance] = useState("0")
  const [transactionLoading, setTransactionLoading] = useState(false)

  const { runContractFunction } = useWeb3Contract()

  const { runContractFunction: getStakedBalance } = useWeb3Contract({
    abi: stakingMonitorAbi,
    contractAddress: stakingMonitorAddress,
    functionName: "getBalance",
    params: {
      account: account,
    },
  })

  useEffect(() => {
    if (isWeb3Enabled && account) {
      console.log("ready")
      updateUiValues()
    }
  }, [account, isWeb3Enabled])

  async function updateUiValues() {
    const balanceFromContract = (
      await getStakedBalance({ onError: (error) => console.log(error) })
    ).toString()
    const formattedStakedBalanceFromContract = ethers.utils.formatUnits(
      balanceFromContract,
      "ether"
    )
    setStakedBalance(formattedStakedBalanceFromContract)
  }

  const dispatch = useNotification()

  let depositOptions = {
    abi: stakingMonitorAbi,
    contractAddress: stakingMonitorAddress,
    functionName: "deposit",
  }

  async function handleDepositSubmit(e) {
    e.preventDefault()
    let status, error
    setTransactionLoading(true)

    const value = e.target[0].value
    depositOptions.msgValue = ethers.utils.parseUnits(value).toString()
    console.log("staking...")
    const tx = await runContractFunction({
      params: depositOptions,
      onError: (error) => {
        status = "error"
        error = error.message
        console.log(error)
        setTransactionLoading(false)
      },
      onSuccess: () => {
        status = "success"
      },
    })
    console.log(tx)
    status === "success" && (await tx.wait(1))
    handleDepositNotification(status, error)
    setTransactionLoading(false)
    await updateUiValues()

    console.log("staked")

    e.target.reset()
  }

  function handleDepositNotification(status, error = null) {
    dispatch({
      type: status === "success" ? "success" : "error",
      message: `Transaction ${
        status === "success" ? "Successful" : `Failed: ${error}`
      }`,
      title: "Transaction Notification",
      position: "topL",
      icon: "bell",
    })
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-500">
        Your Balance is {stakedBalance} ETH
      </h2>
      <StakeForm
        handleDepositSubmit={handleDepositSubmit}
        transactionLoading={transactionLoading}
      />
    </div>
  )
}
