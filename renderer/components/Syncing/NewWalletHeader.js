import React from 'react'
import PropTypes from 'prop-types'
import { Header, Link } from 'components/UI'
import { FormattedMessage } from 'react-intl'
import messages from './messages'

const NewWalletHeader = ({ network }) => (
  <Header
    subtitle={
      network === 'testnet' && (
        <Link onClick={() => window.Zap.openTestnetFaucet()}>
          <FormattedMessage {...messages.fund_link} />
        </Link>
      )
    }
    title={<FormattedMessage {...messages.fund_title} />}
  />
)

NewWalletHeader.propTypes = {
  network: PropTypes.string,
}

export default NewWalletHeader
