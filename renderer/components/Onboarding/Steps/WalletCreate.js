import React from 'react'
import PropTypes from 'prop-types'
import { Form, Spinner, Text } from 'components/UI'

class WalletCreate extends React.Component {
  static propTypes = {
    clearWalletCreateError: PropTypes.func.isRequired,
    createNewWallet: PropTypes.func.isRequired,
    isCreatingNewWallet: PropTypes.bool,
    walletCreateError: PropTypes.string,
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
    const { isCreatingNewWallet, walletCreateError } = this.props

    // Handle success case.
    if (!walletCreateError && !isCreatingNewWallet && prevProps.isCreatingNewWallet) {
      this.handleSuccess()
    }

    // Handle failure case.
    if (walletCreateError && !isCreatingNewWallet && prevProps.isCreatingNewWallet) {
      this.handleError()
    }
  }

  componentWillUnmount() {
    const { clearWalletCreateError } = this.props
    clearWalletCreateError()
  }

  handleSubmit = async () => {
    const { createNewWallet } = this.props
    await createNewWallet()
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  render() {
    const { wizardApi, wizardState, createNewWallet, ...rest } = this.props
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
        onSubmit={async values => {
          try {
            await this.handleSubmit(values)
          } catch (e) {
            wizardApi.onSubmitFailure()
          }
        }}
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
