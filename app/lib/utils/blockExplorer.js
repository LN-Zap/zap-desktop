const showTransaction = (network, txid) =>
  window.Zap.openExternal(`${network.explorerUrl}/tx/${txid}`)

const showBlock = (network, blockHash) =>
  window.Zap.openExternal(`${network.explorerUrl}/block/${blockHash}`)

const showChannelClosing = channel => showTransaction(channel.closing_txid)

const showChannelPoint = channel => showTransaction(channel.channel.channel_point.split(':')[0])

export default {
  showTransaction,
  showBlock,
  showChannelClosing,
  showChannelPoint
}
