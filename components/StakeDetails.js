// how many in wallet
// how many are staked
// how many tokens were earned

import { useState, useEffect } from "react"

import { ethers } from "ethers"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { Button, useNotification } from "web3uikit"

import { stakingMonitorAbi, stakingMonitorAddress } from "../constants"
import StakeForm from "./StakeForm"

export default function StakeDetails() {
  const { account, isWeb3Enabled } = useMoralis()
  const [stakedBalance, setStakedBalance] = useState("0")
  const [transactionLoading, setTransactionLoading] = useState(false)
  const [txType, setTxType] = useState("withdraw")

  const { runContractFunction } = useWeb3Contract()

  const { runContractFunction: getStakedBalance } = useWeb3Contract({
    abi: stakingMonitorAbi,
    contractAddress: stakingMonitorAddress,
    functionName: "getBalance",
    params: {
      account,
    },
  })

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

  useEffect(() => {
    if (isWeb3Enabled && account) {
      console.log("ready")
      updateUiValues()
    }
  }, [account, isWeb3Enabled])

  const dispatch = useNotification()

  const depositOptions = {
    abi: stakingMonitorAbi,
    contractAddress: stakingMonitorAddress,
    functionName: "deposit",
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

  async function handleDepositSubmit(e) {
    e.preventDefault()
    let status
    let error

    setTransactionLoading(true)

    const value = e.target[0].value
    depositOptions.msgValue = ethers.utils.parseUnits(value).toString()
    console.log("staking...")
    const tx = await runContractFunction({
      params: depositOptions,
      onError: (mmError) => {
        status = "error"
        error = mmError.message

        console.log(mmError)
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

  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold text-center text-gray-500">
        Dashboard
      </h2>
      <hr className="mb-4" />
      <div className="flex flex-row items-center justify-between">
        <p>Your Balance is {stakedBalance} ETHsssssssssssssss</p>
        <div className="flex space-x-2">
          <Button
            isFullWidth={true}
            disabled={transactionLoading}
            type="submit"
            // icon="eth"
            text="Withdraw"
            size="large"
            // text={
            //   !transactionLoading ? (
            //     "Confirm Deposit"
            //   ) : (
            //     <Loading spinnerColor="#2e7daf" />
            //   )
            // }
          />
          <Button
            isFullWidth={true}
            disabled={transactionLoading}
            type="submit"
            // icon="eth"
            text="Deposit"
            size="large"
            // text={
            //   !transactionLoading ? (
            //     "Confirm Deposit"
            //   ) : (
            //     <Loading spinnerColor="#2e7daf" />
            //   )
            // }
          />
        </div>
      </div>
      <StakeForm
        txType={txType}
        handleDepositSubmit={handleDepositSubmit}
        transactionLoading={transactionLoading}
      />
    </div>
  )
}
