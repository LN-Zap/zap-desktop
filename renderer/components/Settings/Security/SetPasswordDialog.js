import React, { useRef } from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage, useIntl } from 'react-intl'
import { Flex } from 'rebass/styled-components'

import { PasswordInput, Form } from 'components/Form'
import { Dialog, Heading, Message, Button, DialogOverlay } from 'components/UI'
import { useFormError } from 'hooks'

import messages from './messages'

const SetPasswordDialog = ({ loginError, clearLoginError, onOk, onCancel }) => {
  const intl = useIntl()
  const formApiRef = useRef(null)

  useFormError(loginError, clearLoginError, formApiRef)

  const validate = ({ password, confirmPassword }) => {
    if (password !== confirmPassword) {
      return intl.formatMessage({ ...messages.password_do_not_match })
    }
    return undefined
  }

  const header = (
    <Flex alignItems="center" flexDirection="column" mb={4}>
      <Heading.H1>
        <FormattedMessage {...messages.password_set_dialog_header} />
      </Heading.H1>
    </Flex>
  )

  const handleSubmit = values => onOk(values)

  return (
    <DialogOverlay alignItems="center" justifyContent="center">
      <Form
        getApi={api => {
          formApiRef.current = api
        }}
        onSubmit={handleSubmit}
        validate={validate}
      >
        {({ formState: { submits, error, invalid } }) => {
          const willValidateInline = submits > 0
          return (
            <Dialog
              buttons={
                <>
                  <Button isDisabled={submits > 0 && invalid} type="submit" variant="primary">
                    <FormattedMessage {...messages.password_set_dialog_ok_button_text} />
                  </Button>
                  <Button onClick={onCancel} type="button" variant="secondary">
                    <FormattedMessage {...messages.password_dialog_cancel_button_text} />
                  </Button>
                </>
              }
              header={header}
              onClose={onCancel}
              width={640}
            >
              <Flex alignItems="center" alignSelf="stretch" flexDirection="column" width={350}>
                {error && (
                  <Message mb={3} variant="error">
                    {error}
                  </Message>
                )}
                <PasswordInput
                  description={intl.formatMessage(messages.password)}
                  field="password"
                  hasMessageSpacer
                  isRequired
                  mb={2}
                  validateOnBlur={willValidateInline}
                  validateOnChange={willValidateInline}
                  width={1}
                  willAutoFocus
                />
                <PasswordInput
                  description={intl.formatMessage(messages.password_confirm_password)}
                  field="confirmPassword"
                  hasMessageSpacer
                  isRequired
                  minLength={6}
                  validateOnBlur={willValidateInline}
                  validateOnChange={willValidateInline}
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

SetPasswordDialog.propTypes = {
  clearLoginError: PropTypes.func.isRequired,
  loginError: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
}

export default SetPasswordDialog
