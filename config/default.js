import getPackageDetails from '../utils/getPackageDetails'
import isStableVersion from '../utils/isStableVersion'
// The current stable base version.
// If the current version is in the same range asd this, the default database domain will be used.
const STABLE_VERSION = '0.7.x'

const IS_STABLE_VERSION = isStableVersion(getPackageDetails().version, STABLE_VERSION)

module.exports = {
  // Default debug settings.
  debug: 'zap:main,zap:updater,zap:grpc,lnrpc*',
  debugLevel: 'info',

  // Database settings.
  db: {
    namespace: 'ZapDesktop',
    domain: IS_STABLE_VERSION ? null : 'next',
  },

  theme: 'dark',
  currency: 'USD',
  locale: 'en',

  autoupdate: {
    active: true,
    channel: 'beta',
    interval: 60 * 60 * 1000,
  },

  // Supported chains.
  chains: ['bitcoin'],

  // Supported networks.
  networks: ['mainnet', 'testnet', 'regtest', 'simnet'],

  // Default chain for new wallets (bitcoin).
  chain: 'bitcoin',

  // Default network for new wallets (mainnet|testnet|regtest|simnet).
  network: 'mainnet',

  // Default address format (p2wkh|np2wkh)
  address: 'p2wkh',

  // Default settings for lnd.
  lnd: {
    // Default autopilot settings.
    autopilot: {
      active: false,
      private: true,
      maxchannels: 5,
      minchansize: 20000,
      maxchansize: 16777215,
      allocation: 0.6,
      minconfs: 1,
      heuristics: {
        externalscore: 0.95,
        preferential: 0.05,
      },
    },

    // Default ports.
    // We will search for free ports for lnd to use from these lists (from left to right).
    // To disable an interface, set the host to null.
    rpc: {
      host: 'localhost',
      port: [10009, 10008, 10007, 10006, 10005, 10004, 10003, 10002, 10001],
    },
    rest: {
      host: 'localhost',
      port: [8080, 8081, 8082, 8083, 8084, 8085, 8086, 8087, 8088, 8089],
    },
    p2p: {
      host: '', // disable p2p
      port: [9735, 9734, 9733, 9732, 9731, 9736, 9737, 9738, 9739],
    },

    neutrino: {
      bitcoin: {
        testnet: ['testnet3-btcd.zaphq.io', 'testnet4-btcd.zaphq.io'],
        mainnet: ['mainnet3-btcd.zaphq.io', 'mainnet4-btcd.zaphq.io'],
      },
    },

    assumechanvalid: true,
    recoveryWindow: 2500,
    whitelistPeers: false,
  },

  // Default currency units.
  units: {
    bitcoin: 'sats',
  },

  // Default block explorer (blockstream|blockcypher|smartbit|insight)
  blockExplorer: 'blockstream',
  // Default exchange rate provider (coinbase|bitstamp|kraken|bitfinex)
  rateProvider: 'coinbase',
  // Default invoice settings
  invoices: {
    expire: 3600,
    baseRetryDelay: 1000,
    useAddressFallback: false,
    retryCount: 2, // Number of retries for pay invoice failure
    feeIncrementExponent: 1.1, // Exponent applied to fee limit on payment retry attempts
  },

  payments: {
    timeoutSeconds: 30, // Upper limit on the amount of time (s) we should spend when attempting to send a payment.
    feeLimit: 100, // Upper limit on the routing fees we should accept when sending payment without a limit.
    maxParts: 10, // The maximum number of partial payments that may be used to send a payment.
    allowSelfPayment: true, // If set, circular payments to self are permitted.
  },

  autopay: {
    min: '1',
    max: '1500000',
    defaultValue: '150000',
  },

  channels: {
    // Default view mode(card|list)
    viewMode: 'card',
    // JSON feed for suggested nodes list
    suggestedNodes: 'https://resources.zaphq.io/api/v1/suggested-nodes',
  },

  secureStorage: {
    namespace: IS_STABLE_VERSION ? 'ln-zap' : 'ln-zap-next',
    isWinPlatformSupported: false,
  },

  // feature flags to enable/disable functionality
  features: {
    autopay: false,
    mainnetAutopilot: false,
    networkSelection: false,
    scbRestore: false,
    lnurlAuth: false,
    lnurlChannel: true,
    lnurlWithdraw: true,
    holdInvoice: true,
  },

  // number of onchain confirmations for the specified periods
  lndTargetConfirmations: {
    fast: 1,
    medium: 6,
    slow: 60,
  },
  // number of confirmations for the onchain receiving transaction in the context of
  // transaction finality
  onchainFinality: {
    pending: 0,
    confirmed: 1,
  },

  lnurl: {
    requirePrompt: true,
  },

  // activity list related settings
  activity: {
    pageSize: 250, // Number of items per one fetch
  },

  backup: {
    filename: 'channels.backup',
    gdrive: {
      redirectUrl:
        'com.zap.backup:com.googleusercontent.apps.495822519525-hjpegnbi493ebcrg4t8e7nfa8c3orr4m',
      clientId: '495822519525-hjpegnbi493ebcrg4t8e7nfa8c3orr4m.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/drive.file',
    },

    dropbox: {
      redirectUrl: 'http://localhost/zapdropbox',
      clientId: 'yox444ow4051e1c',
    },
  },
}
