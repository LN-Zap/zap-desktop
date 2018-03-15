export default function subscribeToChannelGraph(mainWindow, lnd) {
  const call = lnd.subscribeChannelGraph({})

  call.on('data', channelGraphData => mainWindow.send('channelGraphData', { channelGraphData }))
  call.on('status', channelGraphStatus => mainWindow.send('channelGraphStatus', { channelGraphStatus }))
}
