import React from 'react'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import get from 'lodash/get'
import { Bar, DataRow, Select } from 'components/UI'
import { getSupportedProviders } from '@zap/utils/rateProvider'
import { FieldLabel, NumberField } from './SettingsFieldHelpers'
import messages from './messages'

const addressItems = [{ key: 'p2wkh' }, { key: 'np2wkh' }]
const addressMessageMapper = key => {
  const filters = {
    p2wkh: messages.address_option_p2wkh,
    np2wkh: messages.address_option_np2wkh,
  }
  return filters[key]
}

const getRateProviders = () => {
  const providers = getSupportedProviders()
  // pluck key and name from config
  return map(providers, ({ id, name }) => ({ key: id, value: name }))
}

const rateProviders = getRateProviders()

const blockExplorerItems = [
  { key: 'blockstream', value: 'Blockstream' },
  { key: 'blockcypher', value: 'Blockcypher' },
  { key: 'smartbit', value: 'Smartbit' },
]

const SettingsFieldsWallet = ({ currentConfig }) => {
  const renderNumberDataRow = path => (
    <DataRow
      left={<FieldLabel itemKey={path} />}
      right={<NumberField field={path} initialValue={get(currentConfig, path)} />}
    />
  )

  return (
    <>
      <DataRow
        left={<FieldLabel itemKey="address" />}
        right={
          <Select
            field="address"
            highlightOnValid={false}
            initialValue={currentConfig.address}
            items={addressItems}
            messageMapper={addressMessageMapper}
          />
        }
      />

      <DataRow
        left={<FieldLabel itemKey="blockExplorer" />}
        right={
          <Select
            field="blockExplorer"
            highlightOnValid={false}
            initialValue={currentConfig.blockExplorer}
            items={blockExplorerItems}
          />
        }
      />
      <Bar variant="light" />
      <DataRow
        left={<FieldLabel itemKey="rateProvider" />}
        right={
          <Select
            field="rateProvider"
            highlightOnValid={false}
            initialValue={currentConfig.rateProvider}
            items={rateProviders}
          />
        }
      />

      <Bar variant="light" />

      {renderNumberDataRow('lndTargetConfirmations.fast')}

      <Bar variant="light" />

      {renderNumberDataRow('lndTargetConfirmations.medium')}

      <Bar variant="light" />

      {renderNumberDataRow('lndTargetConfirmations.slow')}

      <Bar variant="light" />

      {renderNumberDataRow('invoices.expire')}
    </>
  )
}

SettingsFieldsWallet.propTypes = {
  currentConfig: PropTypes.object.isRequired,
}

export default SettingsFieldsWallet
