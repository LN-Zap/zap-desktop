import React from 'react'

import { withFormApi } from 'informed'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass/styled-components'

import Padlock from 'components/Icon/Padlock'
import { Span } from 'components/UI'

import Label from './Label'
import LndConnectionStringInput from './LndConnectionStringInput'
import Toggle from './Toggle'

const LndConnectionStringEditor = ({ formApi, field, hideStringMessage, ...rest }) => {
  const isDisabled = formApi.getValue('hideLndConnectUri')

  const getValue = () => {
    const value = formApi.getValue(field) || ''
    // create obfuscated value if TextArea is disabled
    if (isDisabled) {
      const LND_CONNECT_PREFIX = 'lndconnect://'

      const lndconnectUriBody = value.substr(value.indexOf(LND_CONNECT_PREFIX))
      // replace all chars with *
      return `${LND_CONNECT_PREFIX}${lndconnectUriBody.replace(/./g, '*')}`
    }
    return value
  }

  return (
    <Box>
      <LndConnectionStringInput
        {...rest}
        field={field}
        isReadOnly={isDisabled}
        value={getValue()}
      />
      <Flex alignItems="center" justifyContent="space-between" mt={3}>
        <Flex>
          <Span color="gray" fontSize="s" mr={2}>
            <Padlock />
          </Span>
          <Label htmlFor="private">{hideStringMessage}</Label>
        </Flex>
        <Flex>
          <Toggle field="hideLndConnectUri" initialValue />
        </Flex>
      </Flex>
    </Box>
  )
}

LndConnectionStringEditor.propTypes = {
  field: PropTypes.string.isRequired,
  formApi: PropTypes.object.isRequired,
  hideStringMessage: PropTypes.object.isRequired,
}

export default withFormApi(LndConnectionStringEditor)
