import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex } from 'rebass'
import { Button, Text } from 'components/UI'
import PlusCircle from 'components/Icon/PlusCircle'
import messages from './messages'

const CreateWalletButton = ({ ...rest }) => (
  <Button {...rest} variant="secondary">
    <Flex alignItem="center">
      <Text color="lightningOrange">
        <PlusCircle width="22px" height="22px" />
      </Text>
      <Text lineHeight="22px" ml={2}>
        <FormattedMessage {...messages.create_wallet_button_text} />
      </Text>
    </Flex>
  </Button>
)
export default CreateWalletButton
