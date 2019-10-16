import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass/styled-components'
import { FormattedMessage, useIntl } from 'react-intl'
import { Dialog, Heading, Button, DialogOverlay, Message } from 'components/UI'
import { PasswordInput, Form } from 'components/Form'
import messages from './messages'
import { useFormError } from 'hooks'

const DialogWrapper = ({ loginError, clearLoginError, onOk, onCancel }) => {
  const intl = useIntl()
  const formApiRef = useRef(null)
  useFormError(loginError, clearLoginError, formApiRef)

  const buttons = (
    <>
      <Button type="submit" variant="primary">
        <FormattedMessage {...messages.password_prompt_dialog_ok_button_text} />
      </Button>
      <Button onClick={onCancel} type="button" variant="secondary">
        <FormattedMessage {...messages.password_dialog_cancel_button_text} />
      </Button>
    </>
  )

  const header = (
    <Flex alignItems="center" flexDirection="column" mb={4}>
      <Heading.h1>
        <FormattedMessage {...messages.password_prompt_dialog_header} />
      </Heading.h1>
    </Flex>
  )

  const handleSubmit = values => onOk(values)

  return (
    <DialogOverlay alignItems="center" justifyContent="center" position="fixed">
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
              {error && (
                <Message mb={3} variant="error">
                  {error}
                </Message>
              )}
              <Flex alignItems="center" flexDirection="column" width={350}>
                <PasswordInput
                  description={intl.formatMessage(messages.password_prompt_dialog_description)}
                  field="password"
                  hasMessageSpacer
                  isRequired
                  minLength={6}
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

DialogWrapper.propTypes = {
  clearLoginError: PropTypes.func.isRequired,
  isRestoreMode: PropTypes.bool,
  loginError: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
}

export default DialogWrapper
