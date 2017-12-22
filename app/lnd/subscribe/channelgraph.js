export default function subscribeToChannelGraph(mainWindow, lnd, meta) {
  console.log('subscribeChannelGraph is happening')


  const call = lnd.subscribeChannelGraph({}, meta)

  call.on('data', channelGraphData => mainWindow.send('channelGraphData', { channelGraphData }))
  call.on('end', () => console.log('channel graph end'))
  call.on('error', error => console.log('channelgraph error: ', error))
  call.on('status', channelGraphStatus => mainWindow.send('channelGraphStatus', { channelGraphStatus }))
}
