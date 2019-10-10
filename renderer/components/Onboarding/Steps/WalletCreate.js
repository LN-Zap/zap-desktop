import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Spinner, Text, CenteredContent } from 'components/UI'
import { Form } from 'components/Form'
import ErrorDialog from './components/ErrorDialog'
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

  componentDidUpdate(prevProps) {
    const { isCreatingWallet, createWalletError, wizardApi } = this.props
    if (!isCreatingWallet && prevProps.isCreatingWallet) {
      if (createWalletError) {
        wizardApi.onSubmitFailure()
      }
    }
  }

  componentWillUnmount() {
    const { clearCreateWalletError } = this.props
    clearCreateWalletError()
  }

  handleSubmit = async () => {
    const { createWallet } = this.props
    return createWallet()
  }

  resetOnboarding = () => {
    const { wizardApi } = this.props
    wizardApi.navigateTo(0)
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  UNSAFE_componentWillMount() {
    const { wizardApi } = this.props
    wizardApi.next()
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
      <CenteredContent>
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
          <ErrorDialog
            error={createWalletError}
            isOpen={Boolean(createWalletError)}
            onClose={this.resetOnboarding}
          />
        </Form>
      </CenteredContent>
    )
  }
}

export default WalletCreate
