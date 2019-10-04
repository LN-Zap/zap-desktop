import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass/styled-components'
import { FormattedMessage, useIntl } from 'react-intl'
import { Dialog, Heading, Message, Button, DialogOverlay } from 'components/UI'
import { PasswordInput, Form } from 'components/Form'
import messages from './messages'

const DialogWrapper = ({ loginError, clearLoginError, isOpen, onChange, onCancel }) => {
  const intl = useIntl()
  const formApiRef = useRef(null)
  useEffect(() => {
    const { current: formApi } = formApiRef
    if (loginError) {
      formApi.setFormError(loginError)
      clearLoginError()
    }
  }, [loginError, formApiRef, clearLoginError])

  if (!isOpen) {
    return null
  }

  const buttons = (
    <>
      <Button type="submit" variant="primary">
        <FormattedMessage {...messages.password_change_button_text} />
      </Button>
      <Button onClick={onCancel} type="button" variant="secondary">
        <FormattedMessage {...messages.password_dialog_cancel_button_text} />
      </Button>
    </>
  )

  const header = (
    <Flex alignItems="center" flexDirection="column" mb={4}>
      <Heading.h1>
        <FormattedMessage {...messages.password_change_dialog_header} />
      </Heading.h1>
    </Flex>
  )

  const handleSubmit = values => onChange(values)

  return (
    <DialogOverlay alignItems="center" justifyContent="center" position="fixed">
      <Form getApi={api => (formApiRef.current = api)} onSubmit={handleSubmit}>
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
                <PasswordInput
                  description={intl.formatMessage(messages.password_old_password)}
                  field="oldPassword"
                  hasMessageSpacer
                  isRequired
                  mb={2}
                  validateOnBlur={willValidateInline}
                  validateOnChange={willValidateInline}
                  width={1}
                  willAutoFocus
                />
                <PasswordInput
                  description={intl.formatMessage(messages.password_new_password)}
                  field="newPassword"
                  hasMessageSpacer
                  isRequired
                  minLength={6}
                  width={1}
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
  isOpen: PropTypes.bool.isRequired,
  isRestoreMode: PropTypes.bool,
  loginError: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default DialogWrapper
