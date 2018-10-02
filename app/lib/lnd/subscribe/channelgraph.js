import { status } from 'grpc'
import { mainLog } from '../../utils/log'

export default function subscribeToChannelGraph() {
  const call = this.service.subscribeChannelGraph({})

  call.on('data', channelGraphData => {
    mainLog.debug('CHANNELGRAPH:', channelGraphData)
    if (this.mainWindow) {
      this.mainWindow.send('channelGraphData', { channelGraphData })
    }
  })
  call.on('end', () => mainLog.info('end'))
  call.on('error', error => error.code !== status.CANCELLED && mainLog.error(error))
  call.on('status', channelGraphStatus => {
    mainLog.debug('CHANNELGRAPHSTATUS:', channelGraphStatus)
    if (this.mainWindow) {
      this.mainWindow.send('channelGraphStatus', { channelGraphStatus })
    }
  })

  return call
}
