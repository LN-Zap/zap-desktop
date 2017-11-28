// Send the front end event letting them know LND is synced to the blockchain
export const sendLndSynced = (didFinishLoad, mainWindow) => {
  let sendLndSyncedInterval = setInterval(() => {
    if (didFinishLoad) {
      clearInterval(sendLndSyncedInterval)

      mainWindow.webContents.send('lndSynced')
    }
  }, 1000)
}

// Send the front end event letting them know the gRPC connection has started
export const sendGrpcStarted = (didFinishLoad, mainWindow) => {
  let sendGrpcStartedInterval = setInterval(() => {
    if (didFinishLoad) {
      clearInterval(sendGrpcStartedInterval)

      mainWindow.webContents.send('grpcStarted')
    }
  }, 1000)
}