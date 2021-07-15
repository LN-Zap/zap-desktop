import React, { useRef } from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage, useIntl } from 'react-intl'
import { Flex } from 'rebass/styled-components'

import { PasswordInput, Form } from 'components/Form'
import { Dialog, Heading, Message, Button, DialogOverlay } from 'components/UI'
import { useFormError } from 'hooks'

import messages from './messages'

const ChangePasswordDialog = ({ loginError, clearLoginError, onChange, onCancel }) => {
  const intl = useIntl()
  const formApiRef = useRef(null)
  useFormError(loginError, clearLoginError, formApiRef)

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
      <Heading.H1>
        <FormattedMessage {...messages.password_change_dialog_header} />
      </Heading.H1>
    </Flex>
  )

  const handleSubmit = values => onChange(values)

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

ChangePasswordDialog.propTypes = {
  clearLoginError: PropTypes.func.isRequired,
  loginError: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default ChangePasswordDialog
