import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box } from 'rebass/styled-components'
import { FormattedMessage } from 'react-intl'
import Delete from 'components/Icon/Delete'
import { Dialog, Heading, DialogOverlay, Text, Button } from 'components/UI'
import messages from './messages'

const ErrorDialog = ({ onClose, error, isRestoreMode, isOpen }) => {
  if (!isOpen) {
    return null
  }

  const header = (
    <Flex alignItems="center" flexDirection="column" mb={4}>
      <Box color="superRed" mb={2}>
        <Delete height={72} width={72} />
      </Box>
      <Heading.h1>
        <FormattedMessage {...messages.error_dialog_header} />
      </Heading.h1>
    </Flex>
  )

  const subHeaderMsg = isRestoreMode
    ? messages.error_dialog_recover_wallet_error_desc
    : messages.error_dialog_create_wallet_error_desc

  return (
    <DialogOverlay alignItems="center" justifyContent="center" position="fixed">
      <Dialog
        buttons={
          <Button onClick={onClose} type="button" variant="danger">
            <FormattedMessage {...messages.error_dialog_close_text} />
          </Button>
        }
        header={header}
        onClose={onClose}
        width={640}
      >
        <FormattedMessage {...subHeaderMsg} />
        <Text color="gray" px={4} py={2}>
          {error}
        </Text>
      </Dialog>
    </DialogOverlay>
  )
}

ErrorDialog.propTypes = {
  error: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  isRestoreMode: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
}

export default ErrorDialog
