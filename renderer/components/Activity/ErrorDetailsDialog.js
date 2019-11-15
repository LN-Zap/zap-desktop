import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import copy from 'copy-to-clipboard'
import { Dialog, Text, DialogOverlay, Heading, Button } from 'components/UI'
import messages from './messages'

const ErrorDetailsDialog = ({ error, isOpen, onCopy, onClose, position, ...rest }) => {
  if (!isOpen) {
    return null
  }

  const { details, header } = error
  const headerEl = (
    <Heading.h2 mb={4}>
      {header || <FormattedMessage {...messages.error_dialog_header} />}
    </Heading.h2>
  )

  const handleCopy = () => {
    copy(details)
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
        <Text color="gray" px={4}>
          {details}
        </Text>
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
