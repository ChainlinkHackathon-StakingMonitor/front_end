import { proxy } from "valtio"

// eslint-disable-next-line import/prefer-default-export
export const state = proxy({ balance: "0", user: {} })
