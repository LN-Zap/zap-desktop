import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Box, Flex } from 'rebass'
import { grpc } from 'workers'
import { Bar, CopyBox, TextArea, Text, Form, Button } from 'components/UI'
import messages from './messages'

const ProfilePaneNodeInfo = ({ intl, showNotification, ...rest }) => {
  const [sig, setSig] = useState(null)

  const formApiRef = useRef(null)
  const notifyOfCopy = () =>
    showNotification(intl.formatMessage({ ...messages.sig_copied_notification_description }))

  const onSignMessage = async () => {
    try {
      const { current: formApi } = formApiRef
      const message = formApi.getValue('message')
      const { signature } = await grpc.services.Lightning.signMessage({ msg: Buffer.from(message) })
      setSig(signature)
    } catch (e) {
      setSig(intl.formatMessage({ ...messages.sign_error }))
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
            <FormattedMessage {...messages.sign_message_pane_title} />
          </Text>
          <Text color="gray" fontSize="s" mb={2} mt={2}>
            <FormattedMessage {...messages.feature_desc} />
          </Text>
          <Bar mb={4} mt={2} />
          <TextArea
            css={`
              word-break: break-all;
            `}
            description={intl.formatMessage({ ...messages.sign_message_desc })}
            isRequired
            label={intl.formatMessage({ ...messages.sign_message_label })}
            {...rest}
            field="message"
            spellCheck="false"
          />
          <Button alignSelf="flex-end" mt={3} type="submit" variant="normal">
            <FormattedMessage {...messages.sign_message_action} />
          </Button>
          {sig && (
            <>
              <Text fontWeight="normal" mt={5}>
                <FormattedMessage {...messages.signature} />
              </Text>
              <Bar />

              <CopyBox
                hint={intl.formatMessage({ ...messages.sign_message_action })}
                my={3}
                onCopy={notifyOfCopy}
                value={sig}
              />
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
}

export default injectIntl(ProfilePaneNodeInfo)
