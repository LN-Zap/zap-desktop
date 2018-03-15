export default function pushopenchannel(lnd, event, payload) {
  return new Promise((resolve, reject) => {
    try {
      const call = lnd.openChannel(payload)

      call.on('data', data => event.sender.send('pushchannelupdated', { data }))
      call.on('end', () => event.sender.send('pushchannelend'))
      call.on('error', error => event.sender.send('pushchannelerror', { error: error.toString() }))
      call.on('status', status => event.sender.send('pushchannelstatus', { status }))

      resolve(null, payload)
    } catch (error) {
      reject(error, null)
    }
  })
}
