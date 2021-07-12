/* eslint-disable react/no-this-in-sfc */
import { status } from '@grpc/grpc-js'

import { grpcLog } from '@zap/utils/log'

/**
 * subscribeHtlcEvents - Call lnd grpc subscribeHtlcEvents method and emit events on updates to the stream.
 *
 * @param {object} payload Payload
 * @returns {object} Grpc Call
 */
function subscribeHtlcEvents(payload = {}) {
  if (this.service.subscribeHtlcEvents) {
    const call = this.service.subscribeHtlcEvents(payload)
    call.on('data', data => {
      grpcLog.debug('HTLC EVENT DATA: %o', data)
      this.emit('subscribeHtlcEvents.data', data)
    })
    call.on('error', error => {
      if (error.code !== status.CANCELLED) {
        grpcLog.error('HTLC EVENT ERROR: %o', error)
        this.emit('subscribeHtlcEvents.error', error)
      }
    })
    call.on('status', s => {
      grpcLog.debug('HTLC EVENT STATUS: %o', s)
      this.emit('subscribeHtlcEvents.status', s)
    })
    call.on('end', () => {
      grpcLog.debug('HTLC EVENT END')
      this.emit('subscribeHtlcEvents.end')
    })
    return call
  }
  return null
}

export default {
  subscribeHtlcEvents,
}
