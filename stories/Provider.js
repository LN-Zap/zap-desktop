import EventEmitter from 'events'

import React from 'react'

import config from 'config'
import jstz from 'jstimezonedetect'
import PropTypes from 'prop-types'
import { Provider as ReduxProvider } from 'react-intl-redux'

import { getDefaultLocale } from '@zap/i18n'
import translations from '@zap/i18n/translation'
import { configureStore } from '@zap/renderer/store/configureStore'
import { getDb } from '@zap/renderer/store/db'
import getDbName from '@zap/utils/db'
import { sha256digest } from '@zap/utils/sha256'
import { setTheme } from 'reducers/theme'
import { setCryptoUnit } from 'reducers/ticker'

export const db = getDb(getDbName(config))
db.open()

window.db = db

window.Zap = {
  openExternal: uri => window.open(uri, '_blank'),
  sha256digest,
  getPlatform: () => null,
  splitHostname: host => {
    const { hostname = host, port } = new URL(`http://${host}`)
    return { host: hostname, port }
  },
}

window.ipcRenderer = new EventEmitter()

window.env = {
  ZAP_NAMESPACE: process.env.ZAP_NAMESPACE,
  NODE_ENV: process.env.NODE_ENV,
}

// Default the locale to English.
const defaultLocale = getDefaultLocale()

// Initialise the intl store with data from the users current locale.
export const initialState = {
  intl: {
    locale: defaultLocale,
    messages: translations[defaultLocale],
    timeZone: jstz.determine().name(),
  },
}

export const store = configureStore(initialState)

export const Provider = ({ story }) => {
  return <ReduxProvider store={store}>{story}</ReduxProvider>
}

Provider.propTypes = {
  story: PropTypes.any.isRequired,
}

store.dispatch(setTheme('dark'))
store.dispatch(setCryptoUnit('btc'))

store.dispatch({
  type: 'RECEIVE_INFO',
  data: {
    uris: ['0228e4b5e03a05f700411a8b556fa00d4d76095551c686befb9b7041aaff15cc3e@80.27.24.23:9735'],
    chains: [
      {
        chain: 'bitcoin',
        network: 'mainnet',
      },
    ],
    identityPubkey: '0228e4b5e03a05f700411a8b556fa00d4d76095551c686befb9b7041aaff15cc3e',
    alias: 'AwesomeNode',
    numPendingChannels: 0,
    numActiveChannels: 3,
    numPeers: 4,
    blockHeight: 580083,
    blockHash: '0000000000000000001e693c35a480daa93a3a2b0dfbe1968eb48cdcb8ce6648',
    syncedToChain: true,
    testnet: false,
    bestHeaderTimestamp: 1560161416,
    version: '0.6.1-beta commit=v0.6.1-beta',
    numInactiveChannels: 0,
    semver: '0.6.0-beta',
  },
})
store.dispatch({
  type: 'RECIEVE_TICKERS',
  rates: {
    EUR: '2992.105',
    GBP: '2612.025',
    USD: '3412.015',
  },
})
store.dispatch({
  type: 'FETCH_BALANCE_SUCCESS',
  walletBalance: {
    totalBalance: 25238944,
    confirmedBalance: 25145610,
    unconfirmedBalance: 93334,
  },
  channelBalance: {
    balance: 75238944,
    pendingOpenBalance: 47238944,
  },
})
store.dispatch({
  type: 'RECEIVE_CHANNELS',
  channels: [
    {
      localBalance: 12345,
      remoteBalance: 67890,
      remotePubkey: '1231231231234',
    },
    {
      localBalance: 12345,
      remoteBalance: 67890,
      remotePubkey: '1231231231234',
    },
    {
      localBalance: 12345,
      remoteBalance: 67890,
      remotePubkey: '1231231231234',
    },
  ],
  pendingChannels: {
    totalLimboBalance: null,
    pendingOpenChannels: [],
    pendingClosingChannels: [],
    pendingForceClosingChannels: [],
    waitingCloseChannels: [],
  },
  closedChannels: [],
})
store.dispatch({
  type: 'SET_WALLETS',
  wallets: [
    {
      id: 1,
      type: 'local',
    },
    {
      id: 2,
      type: 'custom',
      lndconnectQRCode:
        'lndconnect://88.26.26.27:10009?cert=MIICfzCCAiWgAwIBAgIRAJFXtYFouMo9heS0kJEiCfMwCgYIKoZIzj0EAwIwPzEfMB0GA1UEChMWbG5kIGF1dG9nZW5lcmF0ZWQgY2VydDEcMBoGA1UEAxMTdGhlZGVhdGhtYWNoaW5lLmxhbjAeFw0xOTA1MjcyMTQyMjhaFw0yMDA3MjEyMTQyMjhaMD8xHzAdBgNVBAoTFmxuZCBhdXRvZ2VuZXJhdGVkIGNlcnQxHDAaBgNVBAMTE3RoZWRlYXRobWFjaGluZS5sYW4wWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAAQIkZTqG-ruD94D68mpLQo7HHou60zoVba9H9EeZWp6gy3pmGMh_OcMiC4OT6PEqKKvY7JUz-NpSD7gV84QAV-wo4IBADCB_TAOBgNVHQ8BAf8EBAMCAqQwDwYDVR0TAQH_BAUwAwEB_zCB2QYDVR0RBIHRMIHOghN0aGVkZWF0aG1hY2hpbmUubGFugglsb2NhbGhvc3SCBHVuaXiCCnVuaXhwYWNrZXSHBH8AAAGHEAAAAAAAAAAAAAAAAAAAAAGHEP6AAAAAAAAAAAAAAAAAAAGHEP6AAAAAAAAABItrqArkQJOHBMCoVvOHEP6AAAAAAAAAUCUS__7MYdmHEP6AAAAAAAAAvfZB3_0jh1-HEP6AAAAAAAAA6yXmoc6giXmHEP6AAAAAAAAAmOLLADrG5kaHEP6AAAAAAAAArt5I__4AESIwCgYIKoZIzj0EAwIDSAAwRQIhAJvRxxXqIHJjgZVsq6HBoss13y8hgZXJMC9fZdPgpQclAiBqEq5VEu10MGpazB7b4xjtar4E0-fHj2Kwd-9RZ1X2ww&macaroon=AgEDbG5kAs8BAwoQ6_AmRbMbkuKoUaZ_1tHQtRIBMBoWCgdhZGRyZXNzEgRyZWFkEgV3cml0ZRoTCgRpbmZvEgRyZWFkEgV3cml0ZRoXCghpbnZvaWNlcxIEcmVhZBIFd3JpdGUaFgoHbWVzc2FnZRIEcmVhZBIFd3JpdGUaFwoIb2ZmY2hhaW4SBHJlYWQSBXdyaXRlGhYKB29uY2hhaW4SBHJlYWQSBXdyaXRlGhQKBXBlZXJzEgRyZWFkEgV3cml0ZRoSCgZzaWduZXISCGdlbmVyYXRlAAAGINqE8YgOZWtcib2v_4es_RWTM8kfpexgVtvQnq_xXGd3',
    },
  ],
})
store.dispatch({
  type: 'SET_SETTING',
  key: 'activeWallet',
  value: 2,
})
