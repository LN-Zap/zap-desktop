import React from 'react'

import get from 'lodash/get'
import map from 'lodash/map'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'

import { intlShape } from '@zap/i18n'
import { getSupportedProviders } from '@zap/utils/rateProvider'
import { Select, Toggle, FieldLabelFactory, PositiveIntegerField } from 'components/Form'
import { Bar, DataRow } from 'components/UI'

import messages from './messages'

const FieldLabel = FieldLabelFactory(messages)

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

/**
 * getInvoicesExpireItems - Get list of supported invoice expire times.
 *
 * @param {intlShape} intl react-intl module
 * @returns {Array} Expire times
 */
const getInvoicesExpireItems = intl => [
  { key: 60, value: intl.formatMessage({ ...messages.durationUnitMinutes }, { value: 1 }) },
  { key: 600, value: intl.formatMessage({ ...messages.durationUnitMinutes }, { value: 10 }) },
  { key: 3600, value: intl.formatMessage({ ...messages.durationUnitHours }, { value: 1 }) },
  { key: 86400, value: intl.formatMessage({ ...messages.durationUnitDays }, { value: 1 }) },
  { key: 604800, value: intl.formatMessage({ ...messages.durationUnitWeeks }, { value: 1 }) },
  { key: 2629746, value: intl.formatMessage({ ...messages.durationUnitMonths }, { value: 1 }) },
  { key: 31536000, value: intl.formatMessage({ ...messages.durationUnitYears }, { value: 1 }) },
]

const SettingsFieldsWallet = ({ currentConfig, intl }) => {
  const renderNumberDataRow = path => (
    <DataRow
      left={<FieldLabel itemKey={path} />}
      right={<PositiveIntegerField field={path} initialValue={get(currentConfig, path)} />}
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

      <Bar variant="light" />

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

      <DataRow
        left={<FieldLabel itemKey="fallbackAddress" />}
        right={
          <Toggle
            field="invoices.useAddressFallback"
            initialValue={currentConfig.invoices.useAddressFallback}
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

      <DataRow
        left={<FieldLabel itemKey="invoices.expire" />}
        right={
          <Select
            field="invoices.expire"
            highlightOnValid={false}
            initialValue={currentConfig.invoices.expire}
            items={getInvoicesExpireItems(intl)}
          />
        }
      />

      <Bar variant="light" />

      {renderNumberDataRow('payments.timeoutSeconds')}

      <Bar variant="light" />

      {renderNumberDataRow('payments.feeLimit')}

      <Bar variant="light" />

      {renderNumberDataRow('payments.maxParts')}
    </>
  )
}

SettingsFieldsWallet.propTypes = {
  currentConfig: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
}

export default injectIntl(SettingsFieldsWallet)
