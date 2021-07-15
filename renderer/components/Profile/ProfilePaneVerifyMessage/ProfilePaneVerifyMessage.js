import React, { useState, useRef } from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Box, Flex } from 'rebass/styled-components'

import { intlShape } from '@zap/i18n'
import { TextArea, Form, Input } from 'components/Form'
import { Bar, CopyBox, Text, Button, Message } from 'components/UI'

import messages from './messages'

const VerificationStatus = ({ isValid }) => (
  <Message mt={3} variant={isValid ? 'success' : 'error'}>
    <FormattedMessage
      {...messages[isValid ? 'signature_status_valid' : 'signature_status_error']}
    />
  </Message>
)

VerificationStatus.propTypes = {
  isValid: PropTypes.bool,
}

const ProfilePaneNodeInfo = ({ intl, verifyMessage, showNotification, ...rest }) => {
  const [info, setInfo] = useState(null)
  const formApiRef = useRef(null)

  const notifyOfCopy = () =>
    showNotification(intl.formatMessage({ ...messages.pubkey_copied_notification_description }))

  const reset = () => setInfo(null)

  const onSignMessage = async () => {
    try {
      const { current: formApi } = formApiRef
      const message = formApi.getValue('message')
      const signature = formApi.getValue('signature')
      const { valid, pubkey } = await verifyMessage(message, signature)
      setInfo({ valid, pubkey })
    } catch (e) {
      setInfo({ valid: false })
    }
  }

  return (
    <Box as="section" {...rest}>
      <Form
        getApi={api => {
          formApiRef.current = api
        }}
        onSubmit={onSignMessage}
      >
        <Flex alignItems="stretch" flexDirection="column">
          <Text fontWeight="normal">
            <FormattedMessage {...messages.verify_pane_title} />
          </Text>
          <Text color="gray" fontSize="s" mb={2} mt={2}>
            <FormattedMessage {...messages.feature_desc} />
          </Text>
          <Bar mb={4} mt={2} />

          <TextArea
            css="word-break: break-all"
            description={intl.formatMessage({ ...messages.verify_message_desc })}
            field="message"
            isRequired
            label={intl.formatMessage({ ...messages.verify_message_label })}
            mb={3}
            onChange={reset}
            spellCheck="false"
          />
          <Input
            description={intl.formatMessage({ ...messages.verify_signature_desc })}
            isRequired
            label={intl.formatMessage({ ...messages.verify_signature_label })}
            onChange={reset}
            {...rest}
            field="signature"
          />
          <Button alignSelf="flex-end" mt={3} type="submit" variant="normal">
            <FormattedMessage {...messages.verify_message_action} />
          </Button>

          {info && (
            <>
              <Text fontWeight="normal" mt={4}>
                <FormattedMessage {...messages.verification} />
              </Text>
              <Bar />
              <VerificationStatus isValid={info.valid} />
              {info.valid && (
                <CopyBox
                  hint={intl.formatMessage({ ...messages.pubkey_hint })}
                  my={3}
                  onCopy={notifyOfCopy}
                  value={info.pubkey}
                />
              )}
            </>
          )}
        </Flex>
      </Form>
    </Box>
  )
}

ProfilePaneNodeInfo.propTypes = {
  intl: intlShape.isRequired,
  showNotification: PropTypes.func.isRequired,
  verifyMessage: PropTypes.func.isRequired,
}

export default injectIntl(ProfilePaneNodeInfo)
