import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'rebass'
import { Form } from 'components/UI'

class WalletSettingsFormRemote extends React.Component {
  static propTypes = {
    wallet: PropTypes.object.isRequired,
    startLnd: PropTypes.func.isRequired
  }

  onSubmit = async values => {
    const { startLnd } = this.props
    return startLnd(values)
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  render() {
    const { wallet, startLnd, ...rest } = this.props
    return (
      <Form
        getApi={this.setFormApi}
        onSubmit={this.onSubmit}
        initialValues={wallet}
        wallet={wallet}
        {...rest}
      >
        <Card bg="tertiaryColor" my={3} p={3}>
          <pre>{JSON.stringify(wallet, null, 2)}</pre>
        </Card>
      </Form>
    )
  }
}

export default WalletSettingsFormRemote
