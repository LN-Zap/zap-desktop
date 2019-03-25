import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { withFormApi } from 'informed'
import Padlock from 'components/Icon/Padlock'
import LndConnectionStringInput from './LndConnectionStringInput'
import Toggle from './Toggle'
import Span from './Span'
import Label from './Label'

function LndConnectionStringEditor({ formApi, field, hideStringMessage, ...rest }) {
  const isDisabled = formApi.getValue('hideLndConnectUri')

  const getValue = isDisabled => {
    // create obfuscated value if TextArea is disabled
    if (isDisabled) {
      const LND_CONNECT_PREFIX = 'lndconnect://'
      const lndconnectUri = formApi.getValue(field) || ''
      const lndconnectUriBody = lndconnectUri.substr(lndconnectUri.indexOf(LND_CONNECT_PREFIX))
      // replace all chars with *
      return { value: `${LND_CONNECT_PREFIX}${lndconnectUriBody.replace(/./g, '*')}` }
    }
    return {}
  }

  return (
    <Box>
      <LndConnectionStringInput
        {...rest}
        {...getValue(isDisabled)}
        field={field}
        isReadOnly={isDisabled}
        rows={12}
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
