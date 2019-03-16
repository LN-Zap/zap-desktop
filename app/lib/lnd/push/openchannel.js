import { mainLog } from '../../utils/log'

const parsePayload = payload => ({
  ...payload,
  node_pubkey: Buffer.from(payload.node_pubkey).toString('hex'),
})

export default function pushopenchannel(lnd, event, payload) {
  return new Promise((resolve, reject) => {
    try {
      const call = lnd.openChannel(payload)

      call.on('data', data => {
        const response = { ...parsePayload(payload), data }
        mainLog.info('CHANNEL DATA', response)
        event.sender.send('pushchannelupdated', response)
      })

      call.on('end', () => {
        const response = parsePayload(payload)
        mainLog.info('CHANNEL END', response)
        event.sender.send('pushchannelend', response)
      })

      call.on('error', error => {
        const response = { ...parsePayload(payload), error: error.toString() }
        mainLog.error('CHANNEL ERROR', response)
        event.sender.send('pushchannelerror', response)
      })

      call.on('status', status => {
        const response = { ...parsePayload(payload), status }
        mainLog.info('CHANNEL STATUS', response)
        event.sender.send('pushchannelstatus', response)
      })

      resolve(call)
    } catch (error) {
      reject(error)
    }
  })
}
