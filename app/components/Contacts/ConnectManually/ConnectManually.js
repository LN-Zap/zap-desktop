import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, intlShape, injectIntl } from 'react-intl'
import { Bar, Button, Form, Header, Input, Panel } from 'components/UI'
import * as yup from 'yup'
import messages from './messages'

class ConnectManually extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    closeManualForm: PropTypes.func.isRequired,
    openSubmitChannelForm: PropTypes.func.isRequired,
    setNode: PropTypes.func.isRequired
  }

  static defaultProps = {
    disabled: false,
    required: false
  }

  validateAddress = value => {
    const { disabled, required } = this.props
    if (disabled) {
      return
    }
    try {
      let validator = yup.string().matches(/(.+@.+)/, 'Invalid format')
      if (required) {
        validator = validator.required()
      }
      validator.validateSync(value)
    } catch (error) {
      return error.message
    }
  }

  onSubmit = values => {
    const { closeManualForm, openSubmitChannelForm, setNode } = this.props

    const [pub_key, addr] = values.address.split('@')

    // the SubmitChannel component is expecting a node object that looks like the following
    // {
    //    pub_key: 'some_string',
    //    addresses: [
    //      {
    //        addr: 'some_host_address'
    //      }
    //    ]
    // }
    // knowing this we will set the node object with the known format and plug in the pubkey + host accordingly
    setNode({ pub_key, addresses: [{ addr }] })

    // now we close the ConnectManually form and open the SubmitChannel form by chaning the channelFormType
    closeManualForm()
    openSubmitChannelForm()
  }

  /**
   * Store the formApi on the component context to make it available at this.formApi.
   */
  setFormApi = formApi => {
    this.formApi = formApi
  }

  render() {
    const { closeManualForm, openSubmitChannelForm, setNode, intl, ...rest } = this.props

    return (
      <Form css={{ height: '100%' }} {...rest} getApi={this.setFormApi} onSubmit={this.onSubmit}>
        {({ formState }) => {
          const shouldValidateInline = formState.submits > 0

          return (
            <Panel {...rest} width={1}>
              <Panel.Header>
                <Header
                  title={<FormattedMessage {...messages.title} />}
                  subtitle={<FormattedMessage {...messages.description} />}
                />
                <Bar mt={2} />
              </Panel.Header>

              <Panel.Body py={3}>
                <Input
                  field="address"
                  label={intl.formatMessage({ ...messages.address_label })}
                  description={intl.formatMessage({ ...messages.address_description })}
                  placeholder={intl.formatMessage({ ...messages.placeholder })}
                  validate={this.validateAddress}
                  validateOnBlur={shouldValidateInline}
                  validateOnChange={shouldValidateInline}
                  required
                />
              </Panel.Body>

              <Panel.Footer mx="auto">
                <Button disabled={formState.pristine || formState.invalid}>
                  <FormattedMessage {...messages.submit} />
                </Button>
              </Panel.Footer>
            </Panel>
          )
        }}
      </Form>
    )
  }
}

export default injectIntl(ConnectManually)
