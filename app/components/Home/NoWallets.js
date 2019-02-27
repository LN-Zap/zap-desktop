import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex } from 'rebass'
import { Heading } from 'components/UI'
import CreateWalletButton from './CreateWalletButton'
import messages from './messages'

const NoWallets = ({ history, wallets }) => (
  <Flex flexDirection="column" justifyContent="center" alignItems="center" css={{ height: '100%' }}>
    {wallets.length === 0 ? (
      <>
        <Heading.h4>
          <FormattedMessage {...messages.no_wallets_message} />
        </Heading.h4>
      </>
    ) : (
      <>
        <Heading.h4>
          <FormattedMessage {...messages.no_active_wallet_message} />
        </Heading.h4>
      </>
    )}
    <Heading.h4 mt={2}>
      <FormattedMessage {...messages.create_wallet_promot} />
    </Heading.h4>
    <CreateWalletButton history={history} p={3} />
  </Flex>
)
NoWallets.propTypes = {
  wallets: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired
}

export default NoWallets
