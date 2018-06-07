import { shell } from 'electron'

const testnetUrl = 'https://testnet.smartbit.com.au'
const mainnetUrl = 'https://smartbit.com.au'

const showTransaction = (isTestnet, txid) => {
  console.log('isTestnet: ', isTestnet)
  console.log('txid: ', txid)
  isTestnet ? shell.openExternal(`${testnetUrl}/tx/${txid}`) : shell.openExternal(`${mainnetUrl}/tx/${txid}`)
}

const showBlock = (isTestnet, blockHash) => isTestnet ? shell.openExternal(`${testnetUrl}/block/${blockHash}`) : shell.openExternal(`${mainnetUrl}/block/${blockHash}`)

const showChannelClosing = channel =>
  showTransaction(channel.closing_txid)

const showChannelPoint = channel =>
  showTransaction(channel.channel.channel_point.split(':')[0])

export default {
  testnetUrl,
  mainnetUrl,
  showTransaction,
  showBlock,
  showChannelClosing,
  showChannelPoint
}
