import "../styles/globals.css"
import { createGlobalStyle } from "styled-components"
import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"

const GlobalStyle = createGlobalStyle`
  html, body{min-height:100%;}
  body {
      background-color: #98d9e1;
      background-image: linear-gradient(315deg, #98d9e1 0%, #d6aed6 74%);
      height:100vh;

}`

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <MoralisProvider initializeOnMount={false}>
        <NotificationProvider>
          <Component {...pageProps} />
        </NotificationProvider>
      </MoralisProvider>
    </>
  )
}

export default MyApp
