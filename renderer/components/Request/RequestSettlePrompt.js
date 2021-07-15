import React, { useRef } from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage, useIntl } from 'react-intl'
import { Flex } from 'rebass/styled-components'

import { Input, Form } from 'components/Form'
import { Button, Dialog, DialogOverlay, Heading, Message, Text } from 'components/UI'
import { useFormError } from 'hooks'

import messages from './messages'

const RequestSettlePrompt = ({ submitError, clearError, onOk, onCancel }) => {
  const intl = useIntl()
  const formApiRef = useRef(null)
  useFormError(submitError, clearError, formApiRef)

  const buttons = (
    <>
      <Button type="submit" variant="primary">
        <FormattedMessage {...messages.request_settle_dialog_confirm_button_text} />
      </Button>
      <Button onClick={onCancel} type="button" variant="secondary">
        <FormattedMessage {...messages.request_settle_dialog_cancel_button_text} />
      </Button>
    </>
  )

  const header = (
    <Flex alignItems="center" flexDirection="column" mb={4}>
      <Heading.H1>
        <FormattedMessage {...messages.request_settle_dialog_dialog_header} />
      </Heading.H1>
    </Flex>
  )

  const handleSubmit = ({ preimage }) => onOk(preimage)

  return (
    <DialogOverlay alignItems="center" justifyContent="center">
      <Form
        getApi={api => {
          formApiRef.current = api
        }}
        onSubmit={handleSubmit}
      >
        {({ formState: { submits, error } }) => {
          const willValidateInline = submits > 0
          return (
            <Dialog buttons={buttons} header={header} onClose={onCancel} width={640}>
              <Flex alignItems="center" alignSelf="stretch" flexDirection="column" width={350}>
                {error && (
                  <Message mb={3} variant="error">
                    {error}
                  </Message>
                )}
                <Text color="gray" mb={3}>
                  <FormattedMessage {...messages.request_settle_dialog_body} />
                </Text>
                <Input
                  description={intl.formatMessage(
                    messages.request_settle_dialog_preimage_description
                  )}
                  field="preimage"
                  hasMessageSpacer
                  isRequired
                  mb={2}
                  validateOnBlur={willValidateInline}
                  validateOnChange={willValidateInline}
                  width={1}
                  willAutoFocus
                />
              </Flex>
            </Dialog>
          )
        }}
      </Form>
    </DialogOverlay>
  )
}

RequestSettlePrompt.propTypes = {
  clearError: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  submitError: PropTypes.string,
}

export default RequestSettlePrompt
