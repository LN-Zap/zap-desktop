import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex } from 'rebass/styled-components'

import PlusCircle from 'components/Icon/PlusCircle'
import { Button, Text } from 'components/UI'

import messages from './messages'

const CreateWalletButton = ({ history, ...rest }) => (
  <Button onClick={() => history.push('/onboarding')} size="small" variant="secondary" {...rest}>
    <Flex alignItem="center">
      <Text color="primaryAccent">
        <PlusCircle height="22px" width="22px" />
      </Text>
      <Text lineHeight="22px" ml={2}>
        <FormattedMessage {...messages.create_wallet_button_text} />
      </Text>
    </Flex>
  </Button>
)
CreateWalletButton.propTypes = {
  history: PropTypes.object.isRequired,
}

export default CreateWalletButton
