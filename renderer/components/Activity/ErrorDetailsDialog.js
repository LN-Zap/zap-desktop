import React from 'react'

import copy from 'copy-to-clipboard'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { Dialog, Text, DialogOverlay, Heading, Button } from 'components/UI'

import messages from './messages'

const ErrorDetailsDialog = ({ error, isOpen, onCopy, onClose, position, ...rest }) => {
  if (!isOpen) {
    return null
  }

  const { details: { message, code } = {}, header } = error
  const headerEl = (
    <Heading.H2 mb={4}>
      {header || <FormattedMessage {...messages.error_dialog_header} />}
    </Heading.H2>
  )

  const handleCopy = () => {
    copy([code, message].join(': '))
    onCopy && onCopy()
  }

  return (
    <DialogOverlay alignItems="center" justifyContent="center" position={position}>
      <Dialog
        header={headerEl}
        {...rest}
        buttons={
          <Button onClick={handleCopy} type="button" variant="normal">
            <FormattedMessage {...messages.error_dialog_copy} />
          </Button>
        }
        onClose={onClose}
      >
        {code && (
          <Text color="lightGray" pb={3} px={4}>
            {code}
          </Text>
        )}
        {message && (
          <Text color="gray" px={4}>
            {message}
          </Text>
        )}
      </Dialog>
    </DialogOverlay>
  )
}

ErrorDetailsDialog.propTypes = {
  error: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCopy: PropTypes.func.isRequired,
  position: PropTypes.string,
}

export default ErrorDetailsDialog
