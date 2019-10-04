import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass/styled-components'
import { FormattedMessage, useIntl } from 'react-intl'
import { Dialog, Heading, Button, DialogOverlay } from 'components/UI'
import { PasswordInput, Form } from 'components/Form'
import messages from './messages'

const DialogWrapper = ({ isOpen, onOk, onCancel, isPromptMode }) => {
  const intl = useIntl()
  if (!isOpen) {
    return null
  }

  const headerMessage = isPromptMode
    ? messages.password_prompt_dialog_header
    : messages.password_set_dialog_header

  const inputDesc = isPromptMode
    ? messages.password_prompt_dialog_description
    : messages.password_set_dialog_description

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
        <FormattedMessage {...headerMessage} />
      </Heading.h1>
    </Flex>
  )

  const handleSubmit = values => onOk(values)

  return (
    <DialogOverlay alignItems="center" justifyContent="center" position="fixed">
      <Form onSubmit={handleSubmit}>
        <Dialog buttons={buttons} header={header} onClose={onCancel} width={640}>
          <Flex alignItems="center" flexDirection="column" width={350}>
            <PasswordInput
              description={intl.formatMessage(inputDesc)}
              field="password"
              hasMessageSpacer
              isRequired
              minLength={6}
              width={1}
              willAutoFocus
            />
          </Flex>
        </Dialog>
      </Form>
    </DialogOverlay>
  )
}

DialogWrapper.defaultProps = {
  isPromptMode: true,
}

DialogWrapper.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isPromptMode: PropTypes.bool,
  isRestoreMode: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
}

export default DialogWrapper
