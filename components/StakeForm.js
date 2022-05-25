// staking abi
// staking address
// how much they want to stake
// approve the reward token

import { Button, Loading, Input } from "web3uikit"

export default function StakeForm({
  handleDepositWithdrawalSubmit,
  transactionLoading,
  isDeposit,
  curr,
  max,
}) {
  const inputProps = {}

  if (!isDeposit) {
    inputProps.max = max
  }

  return (
    <form className="my-4" onSubmit={handleDepositWithdrawalSubmit}>
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
          step=".01"
          required
          {...inputProps}
        />
      </div>
      <Button
        isFullWidth={true}
        disabled={transactionLoading}
        type="submit"
        icon="eth"
        size="large"
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
