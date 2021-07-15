import React from 'react'

import { withFieldState } from 'informed'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Flex, Box } from 'rebass/styled-components'

import { intlShape } from '@zap/i18n'
import { Checkbox, Form } from 'components/Form'
import Delete from 'components/Icon/Delete'
import { Dialog, Text, Heading, Button, DialogOverlay } from 'components/UI'

import messages from './messages'

const DialogWrapper = ({ intl, isOpen, walletDir, onDelete, onCancel }) => {
  if (!isOpen) {
    return null
  }
  const checkboxFieldName = 'actionACK'

  // bind button disabled state to a form field or ignore it if we are dealing with a remote
  // wallet and don't have confirmation checkbox
  const DeleteWalletButton = withFieldState(checkboxFieldName)(({ fieldState, ...rest }) => (
    <Button isDisabled={walletDir && !fieldState.value} {...rest} />
  ))

  const buttons = (
    <>
      <DeleteWalletButton type="submit" variant="danger">
        <FormattedMessage {...messages.delete_wallet_dialog_delete_text} />
      </DeleteWalletButton>
      <Button onClick={onCancel} type="button" variant="secondary">
        <FormattedMessage {...messages.delete_wallet_dialog_cancel_text} />
      </Button>
    </>
  )

  const header = (
    <Flex alignItems="center" flexDirection="column" mb={4}>
      <Box color="superRed" mb={2}>
        <Delete height={72} width={72} />
      </Box>
      <Heading.H1 textAlign="center">
        <FormattedMessage {...messages.delete_wallet_dialog_header} />
      </Heading.H1>
    </Flex>
  )

  const handleSubmit = () => onDelete()

  return (
    <DialogOverlay alignItems="center" justifyContent="center">
      <Form onSubmit={handleSubmit}>
        <Dialog buttons={buttons} header={header} onClose={onCancel} width={640}>
          {walletDir && (
            <Flex alignItems="center" flexDirection="column">
              <Flex alignItems="flex-start" flexDirection="column">
                <Text color="gray" mb={2}>
                  <FormattedMessage {...messages.delete_wallet_dialog_warning} />
                </Text>

                <Text color="gray">{walletDir}</Text>
              </Flex>
              <Checkbox
                field={checkboxFieldName}
                label={intl.formatMessage({ ...messages.delete_wallet_dialog_acknowledgement })}
                mt={4}
              />
            </Flex>
          )}
        </Dialog>
      </Form>
    </DialogOverlay>
  )
}

DialogWrapper.propTypes = {
  intl: intlShape.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  walletDir: PropTypes.string,
}

export default injectIntl(DialogWrapper)
