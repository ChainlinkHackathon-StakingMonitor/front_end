// how many in wallet
// how many are staked
// how many tokens were earned

import { useState, useEffect, useContext } from "react"

import { ethers } from "ethers"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { Button, useNotification } from "web3uikit"

import { stakingMonitorAbi } from "../constants"
import StakeForm from "./StakeForm"
import AppContext from "../store/AppContext"

export default function StakeDetails() {
  const { network } = useContext(AppContext)
  const { currency, address } = network

  const { account, isWeb3Enabled } = useMoralis()
  const [stakedBalance, setStakedBalance] = useState("0")
  const [transactionLoading, setTransactionLoading] = useState(false)
  const [isDeposit, setIsDeposit] = useState(true)

  const { runContractFunction } = useWeb3Contract()

  const { runContractFunction: getDepositBalance } = useWeb3Contract({
    abi: stakingMonitorAbi,
    contractAddress: address,
    functionName: "getDepositBalance",
    params: {
      account,
    },
  })

  const handleTxType = (tx) => {
    setIsDeposit(!isDeposit)
  }

  async function updateUiValues() {
    let balanceFromContract = await getDepositBalance({
      onError: (error) => console.log(error),
    })

    balanceFromContract = balanceFromContract
      ? balanceFromContract.toString()
      : 0
    const formattedStakedBalanceFromContract = ethers.utils.formatUnits(
      balanceFromContract,
      "ether"
    )
    setStakedBalance(formattedStakedBalanceFromContract)
  }

  useEffect(() => {
    if (isWeb3Enabled && account && Object.keys(network).length > 0) {
      console.log("ready")
      updateUiValues()
    }
  }, [account, isWeb3Enabled, network])

  const dispatch = useNotification()

  const depositOptions = {
    abi: stakingMonitorAbi,
    contractAddress: address,
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
    const tx = await runContractFunction({
      params: depositOptions,
      onError: (mmError) => {
        status = "error"
        error = mmError.message

        setTransactionLoading(false)
      },
      onSuccess: () => {
        status = "success"
      },
    })

    status === "success" && (await tx.wait(1))
    handleDepositNotification(status, error)
    setTransactionLoading(false)
    await updateUiValues()

    e.target.reset()
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold text-center text-gray-500">
        Dashboard
      </h2>
      <hr className="mb-4" />
      <div className="flex flex-row items-center justify-between">
        <p>
          Your Balance is {stakedBalance} {currency}
        </p>
        <div className="flex space-x-2">
          <Button
            isFullWidth={true}
            disabled={transactionLoading || isDeposit}
            type="submit"
            // icon="eth"
            text="Deposit"
            size="large"
            theme={isDeposit ? "primary" : "submit"}
            onClick={handleTxType}
          />
          <Button
            isFullWidth={true}
            disabled={transactionLoading || !isDeposit}
            type="submit"
            // icon="eth"
            text="Withdraw"
            size="large"
            theme={!isDeposit ? "primary" : "submit"}
            onClick={handleTxType}
          />
        </div>
      </div>
      <StakeForm
        isDeposit={isDeposit}
        handleDepositSubmit={handleDepositSubmit}
        transactionLoading={transactionLoading}
        max={stakedBalance}
        curr={currency}
      />
    </div>
  )
}
