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
  const dispatch = useNotification()

  const userOptions = {
    abi: stakingMonitorAbi,
    contractAddress: address,
    functionName: "getUserData",
  }

  const { runContractFunction: getUserData } = useWeb3Contract(userOptions)

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

  const formatPrice = (balanceFromContract) => {
    const bal = balanceFromContract ? balanceFromContract.toString() : 0
    const formattedPrice = parseInt(bal) / 1e8
    return formattedPrice
  }

  async function updateUiValues() {
    const userData = await getUserData({
      onError: (error) => {
        console.log(error)

        dispatch({
          type: "error",
          message: `Error fetching data": ${
            error.message ? error.message : error
          }`,
          title: "Error",
          position: "topL",
          icon: "bell",
        })
      },
    })

    const formattedStakedBalance = formatBalances(userData.depositBalance)
    const formattedDAI = formatBalances(userData.DAIBalance)
    const formattedBalanceRequired = formatBalances(
      userData.balanceToSwap - userData.depositBalance
    )

    const user = {
      DAIBalance: formattedDAI,
      depositBalance: formattedStakedBalance,
      priceLimit: formatPrice(userData.priceLimit),
      swapPercent: parseInt(userData.percentageToSwap.toString()),
      percentageToSwap: parseInt(userData.percentageToSwap.toString()),
      enoughDepositForSwap: userData.enoughDepositForSwap,
      balanceRequired: parseFloat(formattedBalanceRequired),
      created: userData.created,
    }

    console.log(user.percentageToSwap)

    state.balance = formattedStakedBalance
    state.user = user

    setDAIBalance(formattedDAI)
    setStakedBalance(formattedStakedBalance)
  }

  useEffect(() => {
    if (isWeb3Enabled && account && Object.keys(network).length > 0) {
      console.log("ready")
      updateUiValues()
    }
  }, [account, isWeb3Enabled, network])

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
          _amount: ethers.utils.parseUnits(daiBalance.toString()).toString(),
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
          Deposit Balance: {Math.round(stakedBalance * 1e4) / 1e4} {currency}
        </p>
        <div className="flex flex-col md:space-y-0 sm:space-y-2 xs:space-y-2 md:space-x-2 md:flex-row">
          <Button
            isFullWidth={true}
            disabled={transactionLoading || isDeposit}
            // type="submit"
            icon="plus"
            text="Deposit"
            // size="large"
            theme={isDeposit ? "primary" : "submit"}
            onClick={handleTxType}
          />
          <Button
            isFullWidth={true}
            disabled={transactionLoading || !isDeposit}
            // type="submit"
            icon="minus"
            text="Withdraw"
            // size="large"
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
        <p>DAI Balance: {Math.round(daiBalance * 100) / 100}</p>
        <Button
          // isFullWidth={true}
          disabled={daiBalance < 1}
          type="submit"
          icon="metamask"
          size="large"
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
