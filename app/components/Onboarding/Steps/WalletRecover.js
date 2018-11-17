import React from 'react'
import PropTypes from 'prop-types'
import { Form, Spinner, Text } from 'components/UI'

class WalletRecover extends React.Component {
  static propTypes = {
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
    recoverOldWallet: PropTypes.func.isRequired
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {}
  }

  componentDidMount() {
    this.formApi.submitForm()
  }

  handleSubmit = () => {
    const { recoverOldWallet } = this.props
    recoverOldWallet()
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  render() {
    const {
      wizardApi,
      wizardState,
      autopilot,
      setWalletRecover,
      recoverOldWallet,
      ...rest
    } = this.props
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
        <Text textAlign="center">
          <Spinner />
          Importing wallet...
        </Text>
      </Form>
    )
  }
}

export default WalletRecover
