import { shell } from 'electron'

const showTransaction = (network, txid) => shell.openExternal(`${network.explorerUrl}/tx/${txid}`)

const showBlock = (network, blockHash) => shell.openExternal(`${network.explorerUrl}/block/${blockHash}`)

const showChannelClosing = channel => showTransaction(channel.closing_txid)

const showChannelPoint = channel => showTransaction(channel.channel.channel_point.split(':')[0])

export default {
  showTransaction,
  showBlock,
  showChannelClosing,
  showChannelPoint,
}
