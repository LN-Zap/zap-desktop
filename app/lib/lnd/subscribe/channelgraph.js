import { status } from 'grpc'
import { mainLog } from '../../utils/log'

export default function subscribeToChannelGraph() {
  const call = this.lnd.subscribeChannelGraph({})

  call.on('data', channelGraphData => {
    if (this.mainWindow) {
      this.mainWindow.send('channelGraphData', { channelGraphData })
    }
  })
  call.on('end', () => mainLog.info('end'))
  call.on('error', error => error.code !== status.CANCELLED && mainLog.error(error))
  call.on('status', channelGraphStatus => {
    if (this.mainWindow) {
      this.mainWindow.send('channelGraphStatus', { channelGraphStatus })
    }
  })

  return call
}
