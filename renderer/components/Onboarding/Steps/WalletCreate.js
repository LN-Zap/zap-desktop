import React from 'react'
import PropTypes from 'prop-types'
import { Form, Spinner, Text } from 'components/UI'

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

    // Handle success case.
    if (!createWalletError && !isCreatingWallet && prevProps.isCreatingWallet) {
      wizardApi.onSubmit()
    }

    // Handle failure case.
    if (createWalletError && !isCreatingWallet && prevProps.isCreatingWallet) {
      wizardApi.onSubmitFailure()
    }
  }

  componentWillUnmount() {
    const { clearCreateWalletError } = this.props
    clearCreateWalletError()
  }

  handleSubmit = () => {
    const { createWallet } = this.props
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
          Creating wallet...
        </Text>
      </Form>
    )
  }
}

export default WalletCreate
