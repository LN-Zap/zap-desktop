/* eslint-disable react/no-this-in-sfc */
import { status } from '@grpc/grpc-js'
import { grpcLog } from '@zap/utils/log'
import streamify from '@zap/utils/streamify'
import { forwardAll } from '@zap/utils/events'
import methods from './lightning.methods'

/**
 * subscribeChannelGraph - Call lnd grpc subscribeChannelGraph method and emit events on updates to the stream.
 *
 * @param {object} payload Payload
 * @returns {object} Grpc Call
 */
function subscribeChannelGraph(payload = {}) {
  const call = this.service.subscribeChannelGraph(payload)
  call.on('data', data => {
    grpcLog.debug('CHANNELGRAPH DATA: %o', data)
    this.emit('subscribeChannelGraph.data', data)
  })
  call.on('error', error => {
    if (error.code !== status.CANCELLED) {
      grpcLog.error('CHANNELGRAPH ERROR: %o', error)
      this.emit('subscribeChannelGraph.error', error)
    }
  })
  call.on('status', status => {
    grpcLog.info('CHANNELGRAPH STATUS: %o', status)
    this.emit('subscribeChannelGraph.status', status)
  })
  call.on('end', () => {
    grpcLog.info('CHANNELGRAPH END')
    this.emit('subscribeChannelGraph.end')
  })
  return call
}

/**
 * subscribeInvoices - Call lnd grpc subscribeInvoices method and emit events on updates to the stream.
 *
 * @param {object} payload Payload
 * @returns {object} Grpc Call
 */
function subscribeInvoices(payload = {}) {
  const call = this.service.subscribeInvoices(payload)
  call.on('data', data => {
    grpcLog.debug('INVOICES DATA: %o', data)
    this.emit('subscribeInvoices.data', data)
  })
  call.on('error', error => {
    if (error.code !== status.CANCELLED) {
      grpcLog.error('INVOICES ERROR: %o', error)
      this.emit('subscribeInvoices.error', error)
    }
  })
  call.on('status', status => {
    grpcLog.info('INVOICES STATUS: %o', status)
    this.emit('subscribeInvoices.status', status)
  })
  call.on('end', () => {
    grpcLog.info('INVOICES END')
    this.emit('subscribeInvoices.end')
  })
  return call
}

/**
 * subscribeTransactions - Call lnd grpc subscribeTransactions method and emit events on updates to the stream.
 *
 * @param {object} payload Payload
 * @returns {object} Grpc Call
 */
function subscribeTransactions(payload = {}) {
  const call = this.service.subscribeTransactions(payload)
  call.on('data', data => {
    grpcLog.debug('TRANSACTIONS DATA: %o', data)
    this.emit('subscribeTransactions.data', data)
  })
  call.on('error', error => {
    if (error.code !== status.CANCELLED) {
      grpcLog.error('TRANSACTIONS ERROR: %o', error)
      this.emit('subscribeTransactions.error', error)
    }
  })
  call.on('status', status => {
    grpcLog.info('TRANSACTIONS STATUS: %o', status)
    this.emit('subscribeTransactions.status', status)
  })
  call.on('end', () => {
    grpcLog.info('TRANSACTIONS END')
    this.emit('subscribeTransactions.end')
  })
  return call
}
/**
 * subscribeChannelBackups - Call lnd grpc subscribeChannelBackups method and emit events on updates to the stream.
 *
 * @param {object} payload Payload
 * @returns {object} Grpc Call
 */
function subscribeChannelBackups(payload = {}) {
  if (this.service.subscribeChannelBackups) {
    const call = this.service.subscribeChannelBackups(payload)
    call.on('data', data => {
      grpcLog.debug('CHANNEL BACKUP: %o', data)
      this.emit('subscribeChannelBackup.data', data)
    })
    call.on('error', error => {
      if (error.code !== status.CANCELLED) {
        grpcLog.error('CHANNEL BACKUP: %o', error)
        this.emit('subscribeChannelBackup.error', error)
      }
    })
    call.on('status', status => {
      grpcLog.debug('CHANNEL BACKUP: %o', status)
      this.emit('subscribeChannelBackup.status', status)
    })
    call.on('end', () => {
      grpcLog.debug('CHANNEL BACKUP END')
      this.emit('subscribeChannelBackup.end')
    })
    return call
  }
  return null
}

/**
 * subscribeGetInfo - Virtual getInfo stream.
 *
 * @param {{pollInterval}} options Subscription options
 * @returns {object} polling stream for the LND getInfo command
 */
function subscribeGetInfo({ pollInterval = 5000, pollImmediately = false } = {}) {
  const stream = streamify({
    command: methods.getInfo.bind(this),
    dataEventName: 'subscribeGetInfo.data',
    errorEventName: 'subscribeGetInfo.error',
    pollInterval,
    pollImmediately,
  })
  // Setup subscription event forwarders.
  forwardAll(stream, 'subscribeGetInfo', this)
  return stream
}

export default {
  subscribeChannelGraph,
  subscribeInvoices,
  subscribeTransactions,
  subscribeGetInfo,
  subscribeChannelBackups,
}
