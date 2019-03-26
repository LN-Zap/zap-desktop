import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex } from 'rebass'
import { Heading } from 'components/UI'
import CreateWalletButton from './CreateWalletButton'
import messages from './messages'

const NoWallets = ({ history, wallets }) => (
  <Flex alignItems="center" css={{ height: '100%' }} flexDirection="column" justifyContent="center">
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
      <FormattedMessage {...messages.create_wallet_prompt} />
    </Heading.h4>
    <CreateWalletButton history={history} p={3} />
  </Flex>
)
NoWallets.propTypes = {
  history: PropTypes.object.isRequired,
  wallets: PropTypes.array.isRequired,
}

export default NoWallets
