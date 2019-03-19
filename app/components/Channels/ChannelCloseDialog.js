import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box } from 'rebass'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { withFieldState } from 'informed'
import Delete from 'components/Icon/Delete'
import { Dialog, Text, Heading, Button, Checkbox, Form, DialogOverlay } from 'components/UI'
import { useCloseOnUnmount } from 'hooks'
import messages from './messages'

const DialogWrapper = ({ intl, isForceClose, isOpen, onClose, onCancel, csvDelay }) => {
  useCloseOnUnmount(isOpen, onCancel)

  if (!isOpen) {
    return null
  }
  const checkboxFieldName = 'actionACK'
  // bind button disabled state to a form field
  const CloseChannelButton = withFieldState(checkboxFieldName)(({ fieldState, ...rest }) => (
    <Button isDisabled={isForceClose && !fieldState.value} {...rest} />
  ))

  const buttons = (
    <>
      <CloseChannelButton type="submit" variant="danger">
        <FormattedMessage
          {...(isForceClose
            ? messages.close_channel_dialog_force_close_text
            : messages.close_channel_dialog_close_text)}
        />
      </CloseChannelButton>
      <Button onClick={onCancel} type="button" variant="secondary">
        <FormattedMessage {...messages.close_channel_dialog_cancel_text} />
      </Button>
    </>
  )

  const header = (
    <Flex alignItems="center" flexDirection="column" mb={4}>
      <Box color="superRed" mb={2}>
        <Delete height={72} width={72} />
      </Box>
      <Heading.h1>
        <FormattedMessage {...messages.close_channel_dialog_header} />
      </Heading.h1>
    </Flex>
  )

  const handleSubmit = () => onClose(intl.formatMessage({ ...messages.close_channel_notification }))

  return (
    <DialogOverlay alignItems="center" justifyContent="center">
      <Form onSubmit={handleSubmit}>
        <Dialog buttons={buttons} header={header} onClose={onCancel} width={640}>
          <Flex alignItems="center" flexDirection="column">
            <Text color="gray" mb={2} textAlign={isForceClose ? 'left' : 'center'} width={500}>
              <FormattedMessage
                {...(isForceClose
                  ? messages.close_channel_dialog_force_warning
                  : messages.close_channel_dialog_warning)}
                values={{ csvDelay: csvDelay }}
              />
            </Text>
            {isForceClose && (
              <Checkbox
                field={checkboxFieldName}
                label={intl.formatMessage({ ...messages.close_channel_dialog_acknowledgement })}
                mt={4}
              />
            )}
          </Flex>
        </Dialog>
      </Form>
    </DialogOverlay>
  )
}

DialogWrapper.propTypes = {
  csvDelay: PropTypes.number.isRequired,
  intl: intlShape.isRequired,
  isForceClose: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default injectIntl(DialogWrapper)
