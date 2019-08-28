import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass/styled-components'
import { FormattedMessage, injectIntl } from 'react-intl'
import { intlShape } from '@zap/i18n'
import { Bar, Header } from 'components/UI'
import { Form, PasswordInput } from 'components/Form'
import messages from './messages'

class Password extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    setPassword: PropTypes.func.isRequired,
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {},
  }

  handleSubmit = async values => {
    const { setPassword } = this.props
    await setPassword(values.password)
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  render() {
    const { wizardApi, wizardState, setPassword, intl, ...rest } = this.props
    const { getApi, onChange, onSubmit, onSubmitFailure } = wizardApi
    const { currentItem } = wizardState

    return (
      <Form
        {...rest}
        getApi={formApi => {
          this.setFormApi(formApi)
          if (getApi) {
            getApi(formApi)
          }
        }}
        onChange={onChange && (formState => onChange(formState, currentItem))}
        onSubmit={async values => {
          await this.handleSubmit(values)
          if (onSubmit) {
            onSubmit(values)
          }
        }}
        onSubmitFailure={onSubmitFailure}
      >
        {({ formState }) => {
          const shouldValidateInline = formState.submits > 0
          return (
            <>
              <Header
                subtitle={<FormattedMessage {...messages.create_wallet_password_description} />}
                title={<FormattedMessage {...messages.create_wallet_password_title} />}
              />

              <Bar my={4} />

              <Box>
                <PasswordInput
                  autoComplete="current-password"
                  field="password"
                  isRequired
                  label={<FormattedMessage {...messages.password_label} />}
                  minLength={8}
                  placeholder={intl.formatMessage({ ...messages.password_placeholder })}
                  validateOnBlur={shouldValidateInline}
                  validateOnChange={shouldValidateInline}
                  willAutoFocus
                />
              </Box>
            </>
          )
        }}
      </Form>
    )
  }
}

export default injectIntl(Password)
