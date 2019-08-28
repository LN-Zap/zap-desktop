import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Box } from 'rebass/styled-components'
import { intlShape } from '@zap/i18n'
import { Bar, Header } from 'components/UI'
import { Form, Input } from 'components/Form'
import messages from './messages'

class Name extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    name: PropTypes.string,
    setName: PropTypes.func.isRequired,
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {},
    name: '',
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  handleSubmit = values => {
    const { setName } = this.props
    setName(values.name)
  }

  render() {
    const { wizardApi, wizardState, name, setName, intl, ...rest } = this.props
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
        onSubmit={values => {
          this.handleSubmit(values)
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
                subtitle={<FormattedMessage {...messages.wallet_name_description} />}
                title={<FormattedMessage {...messages.wallet_name_title} />}
              />
              <Bar my={4} />
              <Box>
                <Input
                  field="name"
                  initialValue={name}
                  label={<FormattedMessage {...messages.wallet_name_label} />}
                  maxLength={30}
                  name="name"
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

export default injectIntl(Name)
