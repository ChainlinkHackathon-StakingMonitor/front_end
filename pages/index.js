import Header from "../components/Header"
import StakeDetails from "../components/StakeDetails"
import styles from "../styles/Home.module.css"
import StakeForm from "../components/StakeForm"
import { useChain } from "react-moralis"

export default function Home() {
    const { switchNetwork, chainId, chain, account } = useChain()
    return (
        <div className={styles.container}>
            <Header />
            <StakeDetails />
            <StakeForm />
        </div>
    )
}
