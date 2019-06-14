import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import { Bar, DataRow, Select } from 'components/UI'
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

const blockExplorerItems = [{ key: 'blockstream' }, { key: 'blockcypher' }, { key: 'smartbit' }]
const blockExplorerMessageMapper = key => {
  const filters = {
    blockstream: messages.blockExplorer_option_blockstream,
    blockcypher: messages.blockExplorer_option_blockcypher,
    smartbit: messages.blockExplorer_option_smartbit,
  }
  return filters[key]
}

const SettingsFieldsWallet = ({ currentConfig, rateProviderItems }) => {
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
            messageMapper={blockExplorerMessageMapper}
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
            items={rateProviderItems}
          />
        }
      />

      <Bar variant="light" />

      {renderNumberDataRow('lndTargetConfirmations.fast')}

      <Bar variant="light" />

      {renderNumberDataRow('lndTargetConfirmations.medium')}

      <Bar variant="light" />

      {renderNumberDataRow('lndTargetConfirmations.slow')}
    </>
  )
}

SettingsFieldsWallet.propTypes = {
  currentConfig: PropTypes.object.isRequired,
  rateProviderItems: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
}

export default SettingsFieldsWallet
