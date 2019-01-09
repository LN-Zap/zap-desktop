// @flow

import { loadPackageDefinition } from '@grpc/grpc-js'
import { load } from '@grpc/proto-loader'
import StateMachine from 'javascript-state-machine'
import LndConfig from './config'
import { getDeadline, createSslCreds } from './util'
import { validateHost } from '../utils/validateHost'
import methods from './walletUnlockerMethods'
import { mainLog } from '../utils/log'

/**
 * Creates an LND grpc client lightning service.
 * @returns {WalletUnlocker}
 */
class WalletUnlocker {
  service: any
  lndConfig: LndConfig
  fsm: StateMachine

  constructor(lndConfig: LndConfig) {
    this.fsm = new StateMachine({
      init: 'ready',
      transitions: [
        { name: 'connect', from: 'ready', to: 'connected' },
        { name: 'disconnect', from: 'connected', to: 'ready' }
      ],
      methods: {
        onBeforeConnect: this.onBeforeConnect.bind(this),
        onBeforeDisconnect: this.onBeforeDisconnect.bind(this)
      }
    })
    this.service = null
    this.lndConfig = lndConfig
  }

  // ------------------------------------
  // FSM Proxies
  // ------------------------------------

  connect(...args: any[]) {
    return this.fsm.connect(args)
  }
  disconnect(...args: any[]) {
    return this.fsm.disconnect(args)
  }
  is(...args: any[]) {
    return this.fsm.is(args)
  }
  can(...args: any[]) {
    return this.fsm.can(args)
  }

  // ------------------------------------
  // FSM Callbacks
  // ------------------------------------

  /**
   * Connect to the gRPC interface and verify it is functional.
   * @return {Promise<rpc.lnrpc.WalletUnlocker>}
   */
  async onBeforeConnect() {
    mainLog.info('Connecting to WalletUnlocker gRPC service')
    const { rpcProtoPath, host, cert } = this.lndConfig

    // Verify that the host is valid before creating a gRPC client that is connected to it.
    return await validateHost(host).then(async () => {
      // Load the gRPC proto file.
      // The following options object closely approximates the existing behavior of grpc.load.
      // See https://github.com/grpc/grpc-node/blob/master/packages/grpc-protobufjs/README.md
      const options = {
        keepCase: true,
        longs: Number,
        enums: String,
        defaults: true,
        oneofs: true
      }
      const packageDefinition = await load(rpcProtoPath, options)

      // Load gRPC package definition as a gRPC object hierarchy.
      const rpc = loadPackageDefinition(packageDefinition)

      // Create ssl credentials to use with the gRPC client.
      const sslCreds = await createSslCreds(cert)

      // Create a new gRPC client instance.
      this.service = new rpc.lnrpc.WalletUnlocker(host, sslCreds)

      // Wait for the gRPC connection to be established.
      return new Promise((resolve, reject) => {
        this.service.waitForReady(getDeadline(20), err => {
          if (err) {
            if (this.service) {
              this.service.close()
            }
            return reject(err)
          }
          return resolve()
        })
      })
    })
  }

  /**
   * Discomnnect the gRPC service.
   */
  onBeforeDisconnect() {
    mainLog.info('Disconnecting from WalletUnlocker gRPC service')
    if (this.service) {
      this.service.close()
    }
  }

  // ------------------------------------
  // Helpers
  // ------------------------------------

  /**
   * Hook up lnd restful methods.
   */
  registerMethods(event: Event, msg: string, data: any) {
    return methods(this.service, mainLog, event, msg, data, this.lndConfig)
  }
}

export default WalletUnlocker
