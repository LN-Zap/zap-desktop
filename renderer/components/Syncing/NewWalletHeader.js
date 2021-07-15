import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { Header, Link } from 'components/UI'

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
    title={<FormattedMessage {...messages.fund_heading} />}
  />
)

NewWalletHeader.propTypes = {
  network: PropTypes.string,
}

export default NewWalletHeader
