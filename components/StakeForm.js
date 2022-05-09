// staking abi
// staking address
// how much they want to stake
// approve the reward token

import { Button, Loading, Input, useNotification } from "web3uikit"

export default function StakeForm({ handleDepositSubmit, transactionLoading }) {
  return (
    <form className="my-4" onSubmit={handleDepositSubmit}>
      {/* <p></p> */}
      <div className="relative my-4">
        <Input
          style={{
            marginTop: "30px",
            marginBottom: "30px",
          }}
          width="100%"
          label="Make a deposit (in ETH)"
          type="number"
          // min="0.01"
          step=".01"
          required
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
            "Confirm Deposit"
          ) : (
            <Loading spinnerColor="#2e7daf" />
          )
        }
      />
    </form>
  )
}
