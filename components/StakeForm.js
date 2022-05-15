// staking abi
// staking address
// how much they want to stake
// approve the reward token

import { Button, Loading, Input } from "web3uikit"

export default function StakeForm({
  handleDepositSubmit,
  transactionLoading,
  isDeposit,
  curr,
  max,
}) {
  return (
    <form className="my-4" onSubmit={handleDepositSubmit}>
      <div className="relative my-4">
        <Input
          style={{
            marginTop: "30px",
            marginBottom: "30px",
          }}
          width="100%"
          label={
            isDeposit
              ? `Make a deposit (in ${curr})`
              : `Enter withdrawal amount (in ${curr})`
          }
          type="number"
          // min="0.01"
          max={max}
          step=".01"
          required
        />
      </div>
      <Button
        isFullWidth={true}
        disabled={transactionLoading}
        type="submit"
        icon="eth"
        // size="large"
        text={
          !transactionLoading ? (
            // `Confirm Deposit`
            !isDeposit ? (
              "Confirm Withdrawal"
            ) : (
              "Confirm Deposit"
            )
          ) : (
            <Loading spinnerColor="#2e7daf" />
          )
        }
      />
    </form>
  )
}
