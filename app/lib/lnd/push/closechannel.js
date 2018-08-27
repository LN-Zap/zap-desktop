export default function pushclosechannel(lnd, event, payload) {
  return new Promise((resolve, reject) => {
    try {
      const call = lnd.closeChannel(payload)

      call.on('data', data => event.sender.send('pushclosechannelupdated', { data }))
      call.on('end', () => event.sender.send('pushclosechannelend'))
      call.on('error', error => event.sender.send('pushclosechannelerror', { error }))
      call.on('status', status => event.sender.send('pushclosechannelstatus', { status }))

      resolve(call)
    } catch (error) {
      reject(error)
    }
  })
}
