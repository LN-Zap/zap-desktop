import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Form, Spinner, Text } from 'components/UI'
import messages from './messages'

class WalletCreate extends React.Component {
  static propTypes = {
    clearCreateWalletError: PropTypes.func.isRequired,
    createWallet: PropTypes.func.isRequired,
    createWalletError: PropTypes.string,
    isCreatingWallet: PropTypes.bool,
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {},
  }

  componentDidMount() {
    const { wizardApi } = this.props
    wizardApi.next()
  }

  componentDidUpdate(prevProps) {
    const { isCreatingWallet, createWalletError, wizardApi } = this.props
    if (!isCreatingWallet && prevProps.isCreatingWallet) {
      if (createWalletError) {
        wizardApi.onSubmitFailure()
      } else {
        wizardApi.onSubmit()
      }
    }
  }

  componentWillUnmount() {
    const { clearCreateWalletError } = this.props
    clearCreateWalletError()
  }

  handleSubmit = async () => {
    const { createWallet } = this.props
    // wait until wallet creation is complete to obtain id
    createWallet()
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  render() {
    const {
      wizardApi,
      wizardState,
      createWallet,
      clearCreateWalletError,
      createWalletError,
      isCreatingWallet,
      ...rest
    } = this.props
    const { getApi, onChange, onSubmitFailure } = wizardApi
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
        onSubmit={this.handleSubmit}
        onSubmitFailure={onSubmitFailure}
      >
        <Text textAlign="center">
          <Spinner />
          <FormattedMessage {...messages.creating_wallet} />
        </Text>
      </Form>
    )
  }
}

export default WalletCreate
