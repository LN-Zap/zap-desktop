import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass'
import { FormattedMessage, injectIntl } from 'react-intl'
import { intlShape } from '@zap/i18n'
import { Bar, Header } from 'components/UI'
import { Form, Input } from 'components/Form'
import SvgEye from 'components/Icon/Eye'
import SvgEyeOff from 'components/Icon/EyeOff'
import messages from './messages'

class Password extends React.Component {
  state = {
    isPasswordVisible: false,
  }

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

  toggleIsPasswordVisible = () => {
    this.setState(prevState => ({
      isPasswordVisible: !prevState.isPasswordVisible,
    }))
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  render() {
    const { wizardApi, wizardState, setPassword, intl, ...rest } = this.props
    const { getApi, onChange, onSubmit, onSubmitFailure } = wizardApi
    const { currentItem } = wizardState
    const { isPasswordVisible } = this.state

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
                <Input
                  autoComplete="current-password"
                  field="password"
                  isRequired
                  label={<FormattedMessage {...messages.password_label} />}
                  minLength={8}
                  name="password"
                  placeholder={intl.formatMessage({ ...messages.password_placeholder })}
                  type={isPasswordVisible ? 'text' : 'password'}
                  validateOnBlur={shouldValidateInline}
                  validateOnChange={shouldValidateInline}
                  willAutoFocus
                >
                  {(() => {
                    const css = `
                      cursor: pointer;
                      height: 32px;
                      padding: 0 8px;
                      position: absolute;
                      right: 8px;
                      user-select: none;
                      width: 32px;
                    `

                    return isPasswordVisible ? (
                      <SvgEyeOff css={css} onClick={this.toggleIsPasswordVisible} />
                    ) : (
                      <SvgEye css={css} onClick={this.toggleIsPasswordVisible} />
                    )
                  })()}
                </Input>
              </Box>
            </>
          )
        }}
      </Form>
    )
  }
}

export default injectIntl(Password)
