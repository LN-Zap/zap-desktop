export default function subscribeToChannelGraph(mainWindow, lnd, meta) {
  const call = lnd.subscribeChannelGraph({}, meta)

  call.on('data', channelGraphData => mainWindow.send('channelGraphData', { channelGraphData }))
  call.on('status', channelGraphStatus => mainWindow.send('channelGraphStatus', { channelGraphStatus }))
}
