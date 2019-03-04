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
    <Button disabled={isForceClose && !fieldState.value} {...rest} />
  ))

  const buttons = (
    <>
      <CloseChannelButton variant="danger" type="submit">
        <FormattedMessage
          {...(isForceClose
            ? messages.close_channel_dialog_force_close_text
            : messages.close_channel_dialog_close_text)}
        />
      </CloseChannelButton>
      <Button variant="secondary" type="button" onClick={onCancel}>
        <FormattedMessage {...messages.close_channel_dialog_cancel_text} />
      </Button>
    </>
  )

  const header = (
    <Flex flexDirection="column" alignItems="center" alignSelf="center">
      <Box color="superRed">
        <Delete width={72} height={72} />
      </Box>
      <Heading.h1 mt={4} mb={3}>
        <FormattedMessage {...messages.close_channel_dialog_header} />
      </Heading.h1>
    </Flex>
  )

  const handleSubmit = () => onClose(intl.formatMessage({ ...messages.close_channel_notification }))

  return (
    <DialogOverlay justifyContent="center" alignItems="center">
      <Form onSubmit={handleSubmit}>
        <Dialog header={header} buttons={buttons} onClose={onCancel} width={640}>
          <Flex flexDirection="column" alignItems="center">
            <Text mb={2} color="gray" width={500} textAlign={isForceClose ? 'left' : 'center'}>
              <FormattedMessage
                {...(isForceClose
                  ? messages.close_channel_dialog_force_warning
                  : messages.close_channel_dialog_warning)}
                values={{ csvDelay: csvDelay }}
              />
            </Text>
            {isForceClose && (
              <Checkbox
                label={intl.formatMessage({ ...messages.close_channel_dialog_acknowledgement })}
                field={checkboxFieldName}
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
  isOpen: PropTypes.bool.isRequired,
  isForceClose: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  csvDelay: PropTypes.number.isRequired
}

export default injectIntl(DialogWrapper)
