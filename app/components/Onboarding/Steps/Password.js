import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Bar, Form, Header, PasswordInput } from 'components/UI'
import messages from './messages'

class Password extends React.Component {
  static propTypes = {
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
    setPassword: PropTypes.func.isRequired
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {}
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
                title={<FormattedMessage {...messages.create_wallet_password_title} />}
                subtitle={<FormattedMessage {...messages.create_wallet_password_description} />}
                align="left"
              />

              <Bar my={4} />

              <Box>
                <PasswordInput
                  autoFocus
                  field="password"
                  name="password"
                  label={<FormattedMessage {...messages.password_label} />}
                  required
                  validateOnBlur={shouldValidateInline}
                  validateOnChange={shouldValidateInline}
                  placeholder={intl.formatMessage({ ...messages.password_placeholder })}
                  autoComplete="current-password"
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
