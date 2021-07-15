import config from 'config'
import Dexie from 'dexie'
import encode from 'lndconnect/encode'

const dbVersions = db => {
  // Initial database schema.
  db.version(1).stores({
    settings: 'key',
    wallets: '++id, type, chain, network',
    nodes: 'id',
  })

  // Migrate custom wallets to lndconnect.
  db.version(2).upgrade(tx =>
    tx.wallets.toCollection().modify((wallet, ref) => {
      // All configs are now stored as an lndconnect uri.
      wallet.decoder = 'lnd.lndconnect.v1'

      // Convert old connection props to lndconnect uri.
      if (['custom', 'btcpayserver'].includes(wallet.type)) {
        try {
          const { host, cert, macaroon } = wallet
          const lndconnectUri = encode({ host, cert, macaroon })
          wallet.type = 'custom'
          wallet.lndconnectUri = lndconnectUri
        } catch (e) {
          // There was a problem migrating this wallet config.
          // There isn't a way for us to recover from this, so delete the wallet config to ensure that we don't end up
          // with invalid configs in the database.
          //
          // See https://dexie.org/docs/Collection/Collection.modify()#sample-deleting-object
          delete ref.value
        }
      }

      // Remove old props.
      delete wallet.host
      delete wallet.cert
      delete wallet.macaroon
      delete wallet.string
    })
  )

  // ADd autopay table.
  db.version(3).stores({
    autopay: 'id',
  })

  // Convert old settings to new config overrides
  db.version(4).upgrade(async tx => {
    const configMap = [
      {
        settingsKey: 'theme',
        settingsPath: 'value',
        configPath: 'theme',
      },
      {
        settingsKey: 'locale',
        settingsPath: 'value',
        configPath: 'locale',
      },
      {
        settingsKey: 'fiatTicker',
        settingsPath: 'value',
        configPath: 'currency',
      },
      {
        settingsKey: 'channelViewMode',
        settingsPath: 'value',
        configPath: 'channels.viewMode',
        configMutator: value => {
          switch (value) {
            case 'CHANNEL_LIST_VIEW_MODE_SUMMARY':
              return 'summary'
            case 'CHANNEL_LIST_VIEW_MODE_CARD':
              return 'card'
            default:
              return 'summary'
          }
        },
      },
      {
        settingsKey: 'chain.bitcoin',
        settingsPath: 'value.unit',
        configPath: 'units.bitcoin',
      },
    ]
    const newConfig = {}
    await tx.settings.toCollection().modify((setting, ref) => {
      const c = configMap.find(i => i.settingsKey === setting.key)
      if (c) {
        try {
          const defaultValue = Dexie.getByKeyPath(config, c.configPath)
          let value = Dexie.getByKeyPath(setting, c.settingsPath)
          // Apply value mapper if there is one.
          if (c.configMutator) {
            value = c.configMutator(value)
          }
          // If the value differes from the default, save it into the config.
          if (value && value !== defaultValue) {
            Dexie.setByKeyPath(newConfig, c.configPath, value)
          }
          // Finally, delete the old setting.
          delete ref.value
        } catch (e) {
          // If there was a problem migrating the old setting just delete the setting altogether.
          delete ref.value
        }
      }
    })
    // Save the migrated config overrides.
    await tx.settings.put({ key: 'config', value: newConfig })
  })
}

export default dbVersions
