import { createContext, useEffect, useState } from "react"

import { useMoralis } from "react-moralis"
import { addresses } from "../constants"

const AppContext = createContext()

export function AppProvider({ children }) {
  const { chainId } = useMoralis()

  const userChainId = parseInt(chainId).toString()
  const [network, setNetwork] = useState({})

  useEffect(() => {
    const networkDetails = addresses[userChainId] ? addresses[userChainId] : {}
    setNetwork(networkDetails)
  }, [userChainId])

  const changeNetwork = (id) => {
    const changedId = id.toString()
    setNetwork(addresses[changedId] ? addresses[changedId] : {})
  }

  return (
    <AppContext.Provider value={{ network, changeNetwork }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContext
