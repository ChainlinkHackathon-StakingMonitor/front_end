import axios from "axios"
import { ethers } from "ethers"

// TODO pagination
// function getStuff (cursor, data = []) {
//   let page = 0
//   return axios.get(url)
//   .then(response => {
//       if (!response.data.data.pagination.has_more ) return data
//       page++
//       data.push(...response.data)
//       return getStuff(url?page=page, data)
//   })
// }

const fetchHistory = async (chainId, contractAddress) => {
  try {
    const { data } = await axios.get(
      `https://api.covalenthq.com/v1/${chainId}/events/topics/0xb060b4bc0b559c041526bb46f6fafa52789ac016f9f808a678f4320235634057/?format=JSON&starting-block=31630542&ending-block=latest&sender-address=${contractAddress}&key=${process.env.NEXT_PUBLIC_COVALENT_API_KEY}`
    )

    const typesArray = [
      "uint256 timestamp",
      "uint256 totalReward",
      "uint256 priceLimit",
      "uint256 DAIReceived",
      "uint256 ETHPrice",
    ]
    // const {items} = data.data
    // eslint-disable-next-line camelcase
    const { data: historyData, error, error_message } = data

    const {
      items,
      /* pagination */
    } = historyData

    // indexed event paremeters are returned as topics: https://ethereum.stackexchange.com/a/8661/100414
    const eventData = items.map((item) => {
      const evData = {
        account: ethers.utils.defaultAbiCoder.decode(
          ["address account"],
          item.raw_log_topics[1]
        ),
        logs: ethers.utils.defaultAbiCoder.decode(
          typesArray,
          item.raw_log_data
        ),
      }

      return {
        account: evData.account.account,
        timestamp: evData.logs.timestamp.toString(),
        totalReward: evData.logs.totalReward.toString(),
        priceLimit: evData.logs.priceLimit.toString(),
        daiReceived: evData.logs.DAIReceived.toString(),
        ethPrice: evData.logs.ETHPrice.toString(),
        transaction: item.tx_hash,
      }
    })

    if (error) {
      console.log({ data })
      throw new Error(error_message)
    }

    return eventData.sort((x, y) => {
      return y.timestamp - x.timestamp
    })
  } catch (error) {
    console.log({ error })
    // use the server error response if available
    if (error.response) {
      const serverMessage = error.response.data.error_message

      // throw new Error(serverMessage)
      return {
        error: true,
        message: serverMessage,
      }
    }
    // throw errors that happen in the browser as is
    // throw new Error(error.message)
    return {
      error: true,
      message: error.message,
    }
  }
}

export default fetchHistory
