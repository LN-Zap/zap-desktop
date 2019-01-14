import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Box } from 'rebass'
import { Bar, Form, Header, Input } from 'components/UI'
import messages from './messages'

class Name extends React.Component {
  static propTypes = {
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
    name: PropTypes.string,
    setName: PropTypes.func.isRequired
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {},
    name: ''
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
                title={<FormattedMessage {...messages.wallet_name_title} />}
                subtitle={<FormattedMessage {...messages.wallet_name_description} />}
                align="left"
              />
              <Bar my={4} />
              <Box>
                <Input
                  autoFocus
                  field="name"
                  name="name"
                  label={<FormattedMessage {...messages.wallet_name_label} />}
                  initialValue={name}
                  validateOnBlur={shouldValidateInline}
                  validateOnChange={shouldValidateInline}
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
