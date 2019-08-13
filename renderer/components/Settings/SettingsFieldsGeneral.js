import React from 'react'
import PropTypes from 'prop-types'
import { currencies, locales, getLanguageName } from '@zap/i18n'
import { Bar, DataRow } from 'components/UI'
import { Toggle, Select } from 'components/Form'
import { FieldLabel } from './SettingsFieldHelpers'
import messages from './messages'

const localeItems = locales.map(lang => ({
  key: lang,
  value: getLanguageName(lang),
}))

const currencyItems = currencies.map(currency => ({
  key: currency,
  value: currency,
}))

const themeItems = [{ key: 'dark' }, { key: 'light' }]
const themeMessageMapper = key => {
  const filters = {
    dark: messages.theme_option_dark,
    light: messages.theme_option_light,
  }
  return filters[key]
}

const SettingsFieldsGeneral = ({ currentConfig }) => {
  return (
    <>
      <DataRow
        left={<FieldLabel itemKey="locale" />}
        right={
          <Select
            field="locale"
            highlightOnValid={false}
            initialValue={currentConfig.locale}
            items={localeItems}
          />
        }
      />

      <Bar variant="light" />

      <DataRow
        left={<FieldLabel itemKey="currency" />}
        right={
          <Select
            field="currency"
            highlightOnValid={false}
            initialValue={currentConfig.currency}
            items={currencyItems}
          />
        }
      />

      <Bar variant="light" />

      <DataRow
        left={<FieldLabel itemKey="theme" />}
        right={
          <Select
            field="theme"
            highlightOnValid={false}
            initialValue={currentConfig.theme}
            items={themeItems}
            messageMapper={themeMessageMapper}
          />
        }
      />

      <Bar variant="light" />

      <DataRow
        left={<FieldLabel itemKey="autoupdate.active" />}
        right={<Toggle field="autoupdate.active" initialValue={currentConfig.autoupdate.active} />}
      />
    </>
  )
}

SettingsFieldsGeneral.propTypes = {
  currentConfig: PropTypes.object.isRequired,
}

export default SettingsFieldsGeneral
