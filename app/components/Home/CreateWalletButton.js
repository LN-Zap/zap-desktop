import React from 'react'
import { Flex } from 'rebass'
import { Button, Text } from 'components/UI'
import PlusCircle from 'components/Icon/PlusCircle'

const CreateWalletButton = ({ ...rest }) => (
  <Button {...rest} variant="secondary">
    <Flex alignItem="center">
      <Text color="lightningOrange">
        <PlusCircle width="22px" height="22px" />
      </Text>
      <Text lineHeight="22px" ml={2}>
        Create new wallet
      </Text>
    </Flex>
  </Button>
)
export default CreateWalletButton
