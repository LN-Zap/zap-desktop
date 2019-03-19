import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box } from 'rebass'
import { FormattedMessage, injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'
import Delete from 'components/Icon/Delete'
import { Dialog, Heading, DialogOverlay, Text } from 'components/UI'
import { useCloseOnUnmount } from 'hooks'
import messages from './messages'

const ErrorRow = ({ messageKey, value }) => (
  <Flex>
    <Text fontWeight="normal" mr={2}>
      <FormattedMessage {...messages[messageKey]} />
    </Text>
    <Text>
      {value == null ? <FormattedMessage {...messages.lnd_crashed_dialog_unknown} /> : value}
    </Text>
  </Flex>
)

ErrorRow.propTypes = {
  messageKey: PropTypes.string.isRequired,
  value: PropTypes.string,
}

const DialogLndCrashed = ({ onCancel, lndCrashReason, history, isOpen }) => {
  const handleClose = () => {
    onCancel()
    history.push('/logout')
  }

  useCloseOnUnmount(isOpen, handleClose)

  if (!isOpen) {
    return null
  }

  const header = (
    <Flex alignItems="center" flexDirection="column" mb={4}>
      <Box color="lightningOrange" mb={2}>
        <Delete height={72} width={72} />
      </Box>
      <Heading.h1>
        <FormattedMessage {...messages.lnd_crashed_dialog_header} />
      </Heading.h1>
    </Flex>
  )
  const { code, signal, error } = lndCrashReason
  const body = (
    <>
      <ErrorRow messageKey="lnd_crashed_dialog_code" value={code} />
      <ErrorRow messageKey="lnd_crashed_dialog_signal" value={signal} />
      <ErrorRow messageKey="lnd_crashed_dialog_messgage" value={error} />
    </>
  )
  return (
    <DialogOverlay alignItems="center" justifyContent="center">
      <Dialog
        buttons={[
          {
            name: <FormattedMessage {...messages.lnd_crashed_dialog_button_text} />,
            onClick: handleClose,
          },
        ]}
        header={header}
        onClose={handleClose}
        width={640}
      >
        {body}
      </Dialog>
    </DialogOverlay>
  )
}

DialogLndCrashed.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
  isOpen: PropTypes.bool.isRequired,
  lndCrashReason: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
}

export default withRouter(injectIntl(DialogLndCrashed))
