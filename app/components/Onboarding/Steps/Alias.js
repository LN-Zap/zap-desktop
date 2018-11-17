import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Box } from 'rebass'
import { Bar, Form, Header, Input } from 'components/UI'
import messages from './messages'

class Alias extends React.Component {
  static propTypes = {
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
    alias: PropTypes.string,
    setAlias: PropTypes.func.isRequired
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {},
    alias: ''
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  handleSubmit = values => {
    const { setAlias } = this.props
    setAlias(values.alias)
  }

  render() {
    const { wizardApi, wizardState, alias, setAlias, intl, ...rest } = this.props
    const { getApi, onChange, preSubmit, onSubmit, onSubmitFailure } = wizardApi
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
        preSubmit={preSubmit}
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
                title={<FormattedMessage {...messages.alias_title} />}
                subtitle={<FormattedMessage {...messages.alias_description} />}
                align="left"
              />
              <Bar my={4} />
              <Box>
                <Input
                  field="alias"
                  name="alias"
                  label={<FormattedMessage {...messages.nickname} />}
                  initialValue={alias}
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

export default injectIntl(Alias)
