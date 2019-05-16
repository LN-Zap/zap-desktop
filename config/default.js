import getPackageDetails from '../utils/getPackageDetails'
import isStableVersion from '../utils/isStableVersion'

// The current stable base version.
// If the current version is in the same range asd this, the default database domain will be used.
const STABLE_VERSION = '0.4.x'

module.exports = {
  // Default debug settings.
  debug: 'zap:main,zap:updater,zap:grpc,lnrpc*',
  debugLevel: 'info',

  // Database settings.
  db: {
    namespace: 'ZapDesktop',
    domain: isStableVersion(getPackageDetails().version, STABLE_VERSION) ? null : 'next',
  },

  autoupdate: {
    active: true,
    channel: 'beta',
  },

  // Supported chains.
  chains: ['bitcoin', 'litecoin'],

  // Supported networks.
  networks: ['testnet', 'mainnet'],

  // Default chain for new wallets.
  chain: 'bitcoin',

  // Default network for new wallets.
  network: 'mainnet',

  // Default address format (p2wkh|np2wkh)
  address: 'np2wkh',

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
      minconfs: 0,
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
      host: '0.0.0.0',
      port: [9735, 9734, 9733, 9732, 9731, 9736, 9737, 9738, 9739],
    },

    neutrino: {
      bitcoin: {
        testnet: ['testnet3-btcd.zaphq.io', 'testnet4-btcd.zaphq.io'],
        mainnet: ['mainnet1-btcd.zaphq.io', 'mainnet2-btcd.zaphq.io'],
      },
      litecoin: {
        testnet: [],
        mainnet: [],
      },
    },

    assumechanvalid: true,
    recoveryWindow: 2500,
  },

  // Default curreny units.
  units: {
    bitcoin: 'sats',
    litecoin: 'lits',
  },

  // Default invoice settings
  invoices: {
    expire: 86400,
    baseRetryDelay: 1000,
    retryCount: 3, // Number of retries for pay invoice failure
  },

  autopay: {
    min: '1',
    max: '1500000',
    defaultValue: '150000',
  },

  // feature flags to enable/disable experimental functionality
  features: {
    autopay: false,
    // enables/disables mainnet lnd autopilot setting selection
    // if false, autopilot selection won't be available
    mainnetAutopilot: false,
    networkSelection: false,
  },

  // number of onchain confirmations for the specified periods
  // potentially needs multiple chain support (LTC)
  lndTargetConfirmations: {
    fastestConfCount: 1,
    halfHourConfCount: 3,
    hourConfCount: 6,
  },

  backup: {
    gdrive: {
      redirectUrl:
        'com.zap.backup:com.googleusercontent.apps.495822519525-hjpegnbi493ebcrg4t8e7nfa8c3orr4m',
      clientId: '495822519525-hjpegnbi493ebcrg4t8e7nfa8c3orr4m.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/drive.file',
    },
  },
}
