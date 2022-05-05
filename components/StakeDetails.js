// how many in wallet
// how many are staked
// how many tokens were earned

import { useMoralis, useWeb3Contract } from "react-moralis"
import { rewardTokenAbi, rewardTokenAddress, stakingAddress } from "../constants"
import { useState, useEffect } from "react"

export default function StakeDetails() {
    const { account, isWeb3Enabled } = useMoralis
    const [rtBalance, setRtBalance] = useState("0")
    const [stakedBalance, setStakedBalance] = useState("0")
    const [earnedBalance, setEarnedBalance] = useState("0")

    const { runContractFunction } = useWeb3Contract({
        abi: rewardTokenAbi,
        contractAddress: rewardTokenAddress,
        functionName: "balanceOf",
        params: {
            account: account,
        },
    })

    const { runContractFunction: getStakedBalance } = useWeb3Contract({
        abi: rewardTokenAbi,
        contractAddress: rewardTokenAddress,
        functionName: "stakedFromContract",
        params: {
            account: account,
        },
    })

    console.log(account)

    useEffect(() => {
        if (isWeb3Enabled && account) {
        }
        // update the ui and get balances
    }, [account, isWeb3Enabled])

    async function updateUiValues() {
        const rtBalanceFromContract = (
            await getRtBalance({ onError: (error) => console.log(error) })
        ).toString()
        const formattedRtBalanceFromContract = ethers.utils.formatUnits(
            rtBalanceFromContract,
            "ether"
        )
        setRtBalance(balance)
    }

    // reward token address
    // reward token abi

    return <div>RT Balance is {}</div>
}
