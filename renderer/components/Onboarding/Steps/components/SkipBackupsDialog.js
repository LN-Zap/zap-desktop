import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box } from 'rebass'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { withFieldState } from 'informed'
import Warning from 'components/Icon/Warning'
import { Dialog, Text, Heading, Button, Checkbox, Form, DialogOverlay } from 'components/UI'
import { useCloseOnUnmount } from 'hooks'
import messages from './messages'

const DialogWrapper = ({ intl, isOpen, onSkip, onCancel }) => {
  useCloseOnUnmount(isOpen, onCancel)

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
      <Box color="lightningOrange" mb={2}>
        <Warning height={72} width={72} />
      </Box>
      <Heading.h1>
        <FormattedMessage {...messages.skip_backup_dialog_warning_header} />
      </Heading.h1>
    </Flex>
  )

  const handleSubmit = () => onSkip()

  return (
    <DialogOverlay alignItems="center" justifyContent="center" position="fixed">
      <Form onSubmit={handleSubmit}>
        <Dialog buttons={buttons} header={header} onClose={onCancel} width={640}>
          <Flex alignItems="center" flexDirection="column">
            <Flex alignItems="flex-start" flexDirection="column">
              <Text color="gray" mb={2} width={550}>
                <FormattedMessage {...messages.skip_backup_dialog_warning} />
              </Text>
            </Flex>
            <Checkbox
              field={checkboxFieldName}
              label={intl.formatMessage({ ...messages.skip_backup_dialog_warning_acknowledgement })}
              mt={4}
            />
          </Flex>
        </Dialog>
      </Form>
    </DialogOverlay>
  )
}

DialogWrapper.propTypes = {
  intl: intlShape.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSkip: PropTypes.func.isRequired,
}

export default injectIntl(DialogWrapper)
