import React, { useState } from 'react'

import { themeGet } from '@styled-system/theme-get'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Flex, Box } from 'rebass/styled-components'
import styled from 'styled-components'

import Delete from 'components/Icon/Delete'
import { Dialog, Heading, DialogOverlay, Text, Button, Bar, Span } from 'components/UI'

import messages from './messages'

const ShowDetails = styled(Span)`
  &:hover {
    color: ${themeGet('colors.primaryAccent')};
  }
  cursor: pointer;
`

const DialogAppCrashed = ({ onClose, onSubmit, error, isOpen }) => {
  const [isStackVisible, setIsStackVisible] = useState(false)

  if (!isOpen) {
    return null
  }

  const header = (
    <Flex alignItems="center" flexDirection="column" mb={4}>
      <Box color="primaryAccent" mb={2}>
        <Delete height={72} width={72} />
      </Box>
      <Heading.H1>
        <FormattedMessage {...messages.app_crashed_dialog_header} />
      </Heading.H1>
    </Flex>
  )

  const body = error && (
    <Flex alignItems="center" flexDirection="column" px={4} width={640}>
      <Text textAlign="center">
        {error.message}
        <ShowDetails
          color="gray"
          fontSize="s"
          ml={1}
          onClick={() => setIsStackVisible(!isStackVisible)}
        >
          <FormattedMessage
            {...messages[
              isStackVisible ? 'app_crashed_dialog_hide_stack' : 'app_crashed_dialog_show_stack'
            ]}
          />
        </ShowDetails>
      </Text>

      {isStackVisible && (
        <>
          <Bar mb={2} mt={3} mx={4} variant="light" width="100%" />
          <Text color="gray">{error.stack}</Text>
        </>
      )}
    </Flex>
  )

  const buttons = (
    <Button onClick={() => onSubmit && onSubmit(error)} variant="normal">
      <FormattedMessage {...messages.app_crashed_dialog_submit_issue} />
    </Button>
  )

  return (
    <DialogOverlay alignItems="center" justifyContent="center">
      <Dialog buttons={buttons} header={header} onClose={onClose} width={640}>
        {body}
      </Dialog>
    </DialogOverlay>
  )
}

DialogAppCrashed.propTypes = {
  error: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default injectIntl(DialogAppCrashed)
