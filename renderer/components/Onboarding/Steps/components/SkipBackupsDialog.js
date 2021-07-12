import React from 'react'

import { withFieldState } from 'informed'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Flex, Box } from 'rebass/styled-components'

import { intlShape } from '@zap/i18n'
import { Checkbox, Form } from 'components/Form'
import Warning from 'components/Icon/Warning'
import { Dialog, Text, Heading, Button, DialogOverlay } from 'components/UI'

import messages from './messages'

const DialogWrapper = ({ intl, isOpen, isRestoreMode, onSkip, onCancel, position }) => {
  if (!isOpen) {
    return null
  }
  const checkboxFieldName = 'actionACK'

  const SkipButton = withFieldState(checkboxFieldName)(({ fieldState, ...rest }) => (
    <Button isDisabled={!fieldState.value} {...rest} />
  ))

  const buttons = (
    <>
      <SkipButton type="submit" variant="primary">
        <FormattedMessage {...messages.skip_backup_dialog_warning_skip_text} />
      </SkipButton>
      <Button onClick={onCancel} type="button" variant="secondary">
        <FormattedMessage {...messages.skip_backup_dialog_warning_cancel_text} />
      </Button>
    </>
  )

  const header = (
    <Flex alignItems="center" flexDirection="column" mb={4}>
      <Box color="primaryAccent" mb={2}>
        <Warning height={72} width={72} />
      </Box>
      <Heading.H1 textAlign="center">
        <FormattedMessage {...messages.skip_backup_dialog_warning_header} />
      </Heading.H1>
    </Flex>
  )

  const handleSubmit = () => onSkip()
  const checkboxText = intl.formatMessage({
    ...(isRestoreMode
      ? messages.skip_backup_dialog_restore_warning_acknowledgement
      : messages.skip_backup_dialog_warning_acknowledgement),
  })
  const warningMessage = isRestoreMode
    ? messages.skip_backup_dialog_restore_warning
    : messages.skip_backup_dialog_warning

  return (
    <DialogOverlay alignItems="center" justifyContent="center" position={position}>
      <Form onSubmit={handleSubmit}>
        <Dialog buttons={buttons} header={header} onClose={onCancel} width={640}>
          <Flex alignItems="center" flexDirection="column">
            <Flex alignItems="flex-start" flexDirection="column">
              <Text color="gray" mb={2}>
                <FormattedMessage {...warningMessage} />
              </Text>
            </Flex>
            <Checkbox field={checkboxFieldName} label={checkboxText} mt={4} />
          </Flex>
        </Dialog>
      </Form>
    </DialogOverlay>
  )
}

DialogWrapper.propTypes = {
  intl: intlShape.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isRestoreMode: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onSkip: PropTypes.func.isRequired,
  position: PropTypes.string,
}

export default injectIntl(DialogWrapper)
