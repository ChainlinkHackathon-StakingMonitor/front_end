import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"
import { AppProvider } from "../store/AppContext"

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <AppProvider>
        <NotificationProvider>
          <Component {...pageProps} />
        </NotificationProvider>
      </AppProvider>
    </MoralisProvider>
  )
}

export default MyApp
