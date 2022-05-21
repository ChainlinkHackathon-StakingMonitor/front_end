// how many in wallet
// how many are staked
// how many tokens were earned

import { useState, useEffect, useContext } from "react"
import { ethers } from "ethers"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { Button, Loading, useNotification } from "web3uikit"

import { stakingMonitorAbi } from "../constants"
import StakeForm from "./StakeForm"
import AppContext from "../store/AppContext"
import { state } from "../store/store"

export default function StakeDetails() {
  const { network } = useContext(AppContext)
  const { currency, address } = network

  const { account, isWeb3Enabled } = useMoralis()
  const [stakedBalance, setStakedBalance] = useState("0")
  const [daiBalance, setDAIBalance] = useState("0")

  const [transactionLoading, setTransactionLoading] = useState(false)
  const [withdrawalTxnLoading, setWithdrawalTxnLoading] = useState(false)

  const [isDeposit, setIsDeposit] = useState(true)

  const { runContractFunction } = useWeb3Contract()
  const balanceOptions = {
    abi: stakingMonitorAbi,
    contractAddress: address,
    functionName: "getDepositBalance",
    params: {
      account,
    },
  }
  const { runContractFunction: getDepositBalance } =
    useWeb3Contract(balanceOptions)

  const { runContractFunction: getDAIBalance } = useWeb3Contract({
    ...balanceOptions,
    functionName: "getDAIBalance",
  })

  const handleTxType = (tx) => {
    setIsDeposit(!isDeposit)
  }

  const formatBalances = (balanceFromContract) => {
    const bal = balanceFromContract ? balanceFromContract.toString() : 0
    const formattedStakedBalanceFromContract = ethers.utils.formatUnits(
      bal,
      "ether"
    )

    return formattedStakedBalanceFromContract
  }

  async function updateUiValues() {
    const balanceFromContract = await getDepositBalance({
      onError: (error) => console.log(error),
    })

    const daiBalanceFromContract = await getDAIBalance({
      onError: (error) => console.log(error),
    })

    const formattedStakedBalance = formatBalances(balanceFromContract)
    const formattedDAI = formatBalances(daiBalanceFromContract)

    state.balance = formattedStakedBalance
    setDAIBalance(formattedDAI)
    setStakedBalance(formattedStakedBalance)
  }

  useEffect(() => {
    if (isWeb3Enabled && account && Object.keys(network).length > 0) {
      console.log("ready")
      updateUiValues()
    }
  }, [account, isWeb3Enabled, network])

  const dispatch = useNotification()

  let depositOptions = {
    abi: stakingMonitorAbi,
    contractAddress: address,
    functionName: isDeposit ? "deposit" : "withdrawETH",
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

  async function handleDepositWithdrawalSubmit(e) {
    e.preventDefault()
    let status
    let error

    setTransactionLoading(true)

    const value = e.target[0].value
    if (isDeposit) {
      depositOptions.msgValue = ethers.utils.parseUnits(value).toString()
    } else {
      depositOptions = {
        ...depositOptions,
        params: {
          _amount: ethers.utils.parseUnits(value).toString(),
        },
      }
    }

    const tx = await runContractFunction({
      params: depositOptions,
      onError: (mmError) => {
        status = "error"
        error = Array.isArray(mmError) ? mmError.join(", ") : mmError.message
        console.log({ mmError })

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

  async function handleRewardsWithdrawal(e) {
    e.preventDefault()
    let status
    let error

    setWithdrawalTxnLoading(true)

    const tx = await runContractFunction({
      params: {
        ...depositOptions,
        functionName: "withdrawDAI",
        params: {
          _amount: ethers.utils.parseUnits(daiBalance).toString(),
        },
      },
      onError: (mmError) => {
        status = "error"
        error = mmError.message

        setWithdrawalTxnLoading(false)
      },
      onSuccess: () => {
        status = "success"
      },
    })

    status === "success" && (await tx.wait(1))
    handleDepositNotification(status, error)
    setWithdrawalTxnLoading(false)
    await updateUiValues()
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold text-center text-gray-500">
        Dashboard
      </h2>
      <hr className="mb-4" />
      <div className="flex flex-row items-center justify-between">
        <p>
          Your Staking Balance is {stakedBalance} {currency}
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
        handleDepositWithdrawalSubmit={handleDepositWithdrawalSubmit}
        transactionLoading={transactionLoading}
        max={stakedBalance}
        curr={currency}
      />
      <div className="flex items-center mt-10 space-x-2">
        <p className="text-lg ">DAI BALANCE: {daiBalance}</p>
        <Button
          // isFullWidth={true}
          disabled={daiBalance < 1}
          type="submit"
          icon="metamask"
          // text="Withdraw"
          text={
            !withdrawalTxnLoading ? (
              "Withdraw"
            ) : (
              <Loading spinnerColor="#2e7daf" />
            )
          }
          // size="large"
          theme="submit"
          onClick={handleRewardsWithdrawal}
        />
      </div>
    </div>
  )
}
