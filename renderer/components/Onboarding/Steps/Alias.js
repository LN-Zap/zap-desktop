import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, intlShape, injectIntl } from 'react-intl'
import { Box } from 'rebass'
import { Bar, Form, Header, Input } from 'components/UI'
import messages from './messages'

class Alias extends React.Component {
  static propTypes = {
    alias: PropTypes.string,
    intl: intlShape.isRequired,
    setAlias: PropTypes.func.isRequired,
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {},
    alias: '',
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
                align="left"
                subtitle={<FormattedMessage {...messages.alias_description} />}
                title={<FormattedMessage {...messages.alias_title} />}
              />
              <Bar my={4} />
              <Box>
                <Input
                  field="alias"
                  initialValue={alias}
                  label={<FormattedMessage {...messages.alias_label} />}
                  name="alias"
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

export default injectIntl(Alias)
