/**
 * showBlock - Open a block on an external block explorer.
 *
 * @param  {{explorerUrl:string}} network Network info
 * @param  {string} address Address
 */

const showAddress = (network, address) => {
  window.Zap.openExternal(`${network.explorerUrl}/address/${address}`)
}

/**
 * showTransaction - Open a transaction on an external block explorer.
 *
 * @param  {{explorerUrl:string}} network Network info
 * @param  {string} txid Transaction id
 */
const showTransaction = (network, txid) => {
  window.Zap.openExternal(`${network.explorerUrl}/tx/${txid}`)
}

/**
 * showBlock - Open a block on an external block explorer.
 *
 * @param  {{explorerUrl:string}} network Network info
 * @param  {string} blockHash Block hash
 */
const showBlock = (network, blockHash) => {
  window.Zap.openExternal(`${network.explorerUrl}/block/${blockHash}`)
}

/**
 * showChannelClosing - Open a channel's closing transaction on an external block explorer.
 *
 * @param  {{closing_txid:string}} channel Channel info
 */
const showChannelClosing = channel => {
  showTransaction(channel.closing_txid)
}

/**
 * showChannelPoint - Open a channel's funding transaction on an external block explorer.
 *
 * @param  {{closing_txid:string}} channel Channel info
 */
const showChannelPoint = channel => {
  showTransaction(channel.channel.channel_point.split(':')[0])
}

export default {
  showAddress,
  showTransaction,
  showBlock,
  showChannelClosing,
  showChannelPoint,
}
