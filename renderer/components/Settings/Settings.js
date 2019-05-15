import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Box, Flex } from 'rebass'
import {
  Bar,
  Button,
  DataRow,
  Form,
  Header,
  Input,
  Label,
  Toggle,
  Select,
  Text,
} from 'components/UI'
import { currencies, locales, getLanguageName } from '@zap/i18n'
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

const addressItems = [{ key: 'p2wkh' }, { key: 'np2wkh' }]
const addressMessageMapper = key => {
  const filters = {
    p2wkh: messages.address_option_p2wkh,
    np2wkh: messages.address_option_np2wkh,
  }
  return filters[key]
}

const FieldLabel = ({ itemKey, ...rest }) => {
  const messageKey = itemKey.replace('.', '_')
  return (
    <Box {...rest}>
      <Label htmlFor={itemKey} mb={2}>
        <FormattedMessage {...messages[`${messageKey}_label`]} />
      </Label>
      <Text color="gray" fontWeight="light">
        <FormattedMessage {...messages[`${messageKey}_description`]} />
      </Text>
    </Box>
  )
}

FieldLabel.propTypes = {
  itemKey: PropTypes.string.isRequired,
}

const NumberField = props => (
  <Input
    css={{ 'text-align': 'right' }}
    highlightOnValid={false}
    isRequired
    min="1"
    step="1"
    type="number"
    width={80}
    {...props}
  />
)

const FormButtons = props => (
  <Flex {...props} alignItems="center" justifyContent="space-between">
    <Button mx="auto" type="submit">
      <FormattedMessage {...messages.save} />
    </Button>
  </Flex>
)

const Settings = ({
  intl,
  configureAutoUpdater,
  currentConfig,
  onSubmit,
  setLocale,
  saveConfigOverrides,
  showNotification,
}) => {
  const handleSubmit = async values => {
    // Save the updated settings.
    await saveConfigOverrides(values)

    // Special handling.
    if (values.locale) {
      await setLocale(values.locale)
    }
    if (values.autoupdate) {
      configureAutoUpdater(values.autoupdate)
    }

    // Show a notification.
    const message = intl.formatMessage({ ...messages.submit_success })
    showNotification(message)

    // Finally, run any user supplied submit handler.
    if (onSubmit) {
      onSubmit(values)
    }
  }

  return (
    <Form mx="auto" onSubmit={handleSubmit} width={9 / 16}>
      <Header
        subtitle={<FormattedMessage {...messages.settings_subtitle} />}
        title={<FormattedMessage {...messages.settings_title} />}
      />
      <Bar my={1} />

      <DataRow
        left={<FieldLabel itemKey="locale" />}
        right={
          <Select
            field="locale"
            highlightOnValid={false}
            initialSelectedItem={currentConfig.locale}
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
            initialSelectedItem={currentConfig.currency}
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
            initialSelectedItem={currentConfig.theme}
            items={themeItems}
            messageMapper={themeMessageMapper}
          />
        }
      />

      <Bar variant="light" />

      <DataRow
        left={<FieldLabel itemKey="address" />}
        right={
          <Select
            field="address"
            highlightOnValid={false}
            initialSelectedItem={currentConfig.address}
            items={addressItems}
            messageMapper={addressMessageMapper}
          />
        }
      />

      <Bar variant="light" />

      <DataRow
        left={<FieldLabel itemKey="lndTargetConfirmations.fast" />}
        right={
          <NumberField
            field="lndTargetConfirmations.fast"
            initialValue={currentConfig.lndTargetConfirmations.fast}
          />
        }
      />

      <Bar variant="light" />

      <DataRow
        left={<FieldLabel itemKey="lndTargetConfirmations.medium" />}
        right={
          <NumberField
            field="lndTargetConfirmations.medium"
            initialValue={currentConfig.lndTargetConfirmations.medium}
          />
        }
      />

      <Bar variant="light" />

      <DataRow
        left={<FieldLabel itemKey="lndTargetConfirmations.slow" />}
        right={
          <NumberField
            field="lndTargetConfirmations.slow"
            initialValue={currentConfig.lndTargetConfirmations.slow}
          />
        }
      />

      <Bar variant="light" />

      <DataRow
        left={<FieldLabel itemKey="autoupdate.active" />}
        right={<Toggle field="autoupdate.active" initialValue={currentConfig.autoupdate.active} />}
      />

      <FormButtons />
    </Form>
  )
}

Settings.propTypes = {
  configureAutoUpdater: PropTypes.func.isRequired,
  currentConfig: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  onSubmit: PropTypes.func,
  saveConfigOverrides: PropTypes.func.isRequired,
  setLocale: PropTypes.func.isRequired,
  showNotification: PropTypes.func.isRequired,
}
export default injectIntl(Settings)
