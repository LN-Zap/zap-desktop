import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { withFormApi } from 'informed'
import Padlock from 'components/Icon/Padlock'
import { LndConnectionStringInput, Toggle, Span, Label } from '.'

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
        readOnly={isDisabled}
        field={field}
        rows={12}
      />
      <Flex justifyContent="space-between" alignItems="center" mt={3}>
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
  formApi: PropTypes.object.isRequired,
  hideStringMessage: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired
}

export default withFormApi(LndConnectionStringEditor)
