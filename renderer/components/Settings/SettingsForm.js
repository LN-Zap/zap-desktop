import React from 'react'

import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'

import { intlShape } from '@zap/i18n'
import { Form } from 'components/Form'

import messages from './messages'

const SettingsForm = ({
  intl,
  configureAutoUpdater,
  onSubmit,
  setLocale,
  saveConfigOverrides,
  showNotification,
  showError,
  fetchTickers,
  children,
}) => {
  const handleSubmit = async values => {
    try {
      // Save the updated settings.
      await saveConfigOverrides(values)

      // Special handling.
      if (values.locale) {
        await setLocale(values.locale)
      }
      if (values.autoupdate) {
        configureAutoUpdater(values.autoupdate)
      }
      if (values.rateProvider) {
        fetchTickers()
      }

      // Show a notification.
      const message = intl.formatMessage({ ...messages.submit_success })
      showNotification(message)

      // Finally, run any user supplied submit handler.
      if (onSubmit) {
        onSubmit(values)
      }
    } catch (e) {
      const message = intl.formatMessage({ ...messages.submit_error })
      showError(`${message} ${e.message}`)
    }
  }

  return <Form onSubmit={handleSubmit}>{children}</Form>
}

SettingsForm.propTypes = {
  children: PropTypes.node,
  configureAutoUpdater: PropTypes.func.isRequired,
  fetchTickers: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  onSubmit: PropTypes.func,
  saveConfigOverrides: PropTypes.func.isRequired,
  setLocale: PropTypes.func.isRequired,
  showError: PropTypes.func.isRequired,
  showNotification: PropTypes.func.isRequired,
}
export default injectIntl(SettingsForm)
