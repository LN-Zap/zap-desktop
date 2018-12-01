import React from 'react'
import PropTypes from 'prop-types'
import { Form, Spinner, Text } from 'components/UI'

class WalletCreate extends React.Component {
  static propTypes = {
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
    createNewWallet: PropTypes.func.isRequired
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {}
  }

  componentDidMount() {
    this.formApi.submitForm()
  }

  handleSubmit = () => {
    const { createNewWallet } = this.props
    createNewWallet()
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  render() {
    const {
      wizardApi,
      wizardState,
      autopilot,
      setWalletCreate,
      createNewWallet,
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
          Creating wallet...
        </Text>
      </Form>
    )
  }
}

export default WalletCreate
