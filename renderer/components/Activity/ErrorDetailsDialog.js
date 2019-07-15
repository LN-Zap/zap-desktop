import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'

import { useCloseOnUnmount } from 'hooks'
import { Dialog, Text, DialogOverlay, Heading } from 'components/UI'
import messages from './messages'

const ErrorDetailsDialog = ({ error, isOpen, onOk, ...rest }) => {
  useCloseOnUnmount(isOpen, onOk)

  if (!isOpen) {
    return null
  }

  const { details, header } = error

  const headerEl = (
    <Heading.h1 mb={4}>
      {header || <FormattedMessage {...messages.error_dialog_header} />}
    </Heading.h1>
  )

  return (
    <DialogOverlay alignItems="center" justifyContent="center" position="fixed">
      <Dialog header={headerEl} {...rest} buttons={[{ name: 'Ok', onClick: onOk }]} onClose={onOk}>
        <Text px={4}>{details}</Text>
      </Dialog>
    </DialogOverlay>
  )
}

ErrorDetailsDialog.propTypes = {
  error: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onOk: PropTypes.func.isRequired,
}

export default ErrorDetailsDialog
