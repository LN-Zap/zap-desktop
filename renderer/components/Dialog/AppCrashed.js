import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Flex, Box } from 'rebass'
import { FormattedMessage, injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'
import Delete from 'components/Icon/Delete'
import { Dialog, Heading, DialogOverlay, Text, Button } from 'components/UI'
import messages from './messages'

const DialogAppCrashed = ({ onCancel, error, history, isOpen }) => {
  const [isStackVisible, setIsStackVisible] = useState(false)
  const handleClose = () => {
    onCancel && onCancel()
    history.push('/logout')
  }

  if (!isOpen) {
    return null
  }

  const header = (
    <Flex alignItems="center" flexDirection="column" mb={4}>
      <Box color="superRed" mb={2}>
        <Delete height={72} width={72} />
      </Box>
      <Heading.h1>
        <FormattedMessage {...messages.app_crashed_dialog_header} />
      </Heading.h1>
    </Flex>
  )

  const body = error && (
    <>
      <Text>{error.toString()}</Text>
      <Button onClick={() => setIsStackVisible(!isStackVisible)} variant="secondary">
        <FormattedMessage
          {...messages[
            isStackVisible ? 'app_crashed_dialog_hide_stack' : 'app_crashed_dialog_show_stack'
          ]}
        />
      </Button>
      {isStackVisible && (
        <Text color="gray" fontSize="xs" px={4}>
          {error.stack}
        </Text>
      )}
    </>
  )

  const buttons = (
    <Button onClick={handleClose} variant="danger">
      <FormattedMessage {...messages.app_crashed_dialog_text} />
    </Button>
  )

  return (
    <DialogOverlay alignItems="center" justifyContent="center">
      <Dialog buttons={buttons} header={header} onClose={handleClose} width={640}>
        {body}
      </Dialog>
    </DialogOverlay>
  )
}

DialogAppCrashed.propTypes = {
  error: PropTypes.object.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func,
}

export default withRouter(injectIntl(DialogAppCrashed))
