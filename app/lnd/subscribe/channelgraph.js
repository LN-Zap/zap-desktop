import { status } from 'grpc'

export default function subscribeToChannelGraph(mainWindow, lnd, log) {
  const call = lnd.subscribeChannelGraph({})

  call.on('data', channelGraphData => mainWindow.send('channelGraphData', { channelGraphData }))
  call.on('end', () => log.info('end'))
  call.on('error', error => error.code !== status.CANCELLED && log.error(error))
  call.on('status', channelGraphStatus =>
    mainWindow.send('channelGraphStatus', { channelGraphStatus })
  )

  return call
}
