import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex } from 'rebass/styled-components'
import { Heading } from 'components/UI'
import CreateWalletButton from './CreateWalletButton'
import messages from './messages'

const NoWallets = ({ history, wallets }) => {
  const decoratedOr = () => (
    /* eslint-disable shopify/jsx-no-hardcoded-content */
    <>
      - <FormattedMessage {...messages.or} /> -
    </>
    /* eslint-enable shopify/jsx-no-hardcoded-content */
  )

  return (
    <Flex alignItems="center" flexDirection="column" height="100%" justifyContent="center">
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
      <Heading.h4 my={1}>{decoratedOr()}</Heading.h4>
      <Heading.h4>
        <FormattedMessage {...messages.create_wallet_prompt} />
      </Heading.h4>
      <CreateWalletButton history={history} mt={3} p={3} />
    </Flex>
  )
}

NoWallets.propTypes = {
  history: PropTypes.object.isRequired,
  wallets: PropTypes.array.isRequired,
}

export default NoWallets
