import { status } from '@grpc/grpc-js'
import { mainLog } from '@zap/utils/log'

export default function subscribeToChannelGraph() {
  const call = this.service.subscribeChannelGraph({})

  call.on('data', channelGraphData => {
    mainLog.debug('CHANNELGRAPH:', channelGraphData)
    if (this.mainWindow) {
      this.mainWindow.send('channelGraphData', { channelGraphData })
    }
  })
  call.on('end', () => mainLog.info('CHANNELGRAPH END'))
  call.on('error', error => error.code !== status.CANCELLED && mainLog.error(error))
  call.on('status', channelGraphStatus => {
    mainLog.debug('CHANNELGRAPH STATUS:', channelGraphStatus)
    if (this.mainWindow) {
      this.mainWindow.send('channelGraphStatus', { channelGraphStatus })
    }
  })

  return call
}
