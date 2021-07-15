import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Box } from 'rebass/styled-components'

import { Form, Input } from 'components/Form'
import { Bar, Header } from 'components/UI'

import messages from './messages'

class Name extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    setName: PropTypes.func.isRequired,
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {},
    name: null,
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  handleSubmit = values => {
    const { setName } = this.props
    setName(values.name)
  }

  render() {
    const { wizardApi, wizardState, name, ...rest } = this.props
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
          const willValidateInline = formState.submits > 0
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
                  validateOnBlur={willValidateInline}
                  validateOnChange={willValidateInline}
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

export default Name
