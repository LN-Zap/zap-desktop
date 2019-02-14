import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { withFieldState } from 'informed'
import Delete from 'components/Icon/Delete'
import { Dialog, Text, Heading, Button, Checkbox, Form, DialogOverlay } from 'components/UI'
import messages from './messages'

const DialogWrapper = ({ intl, isOpen, walletDir, onDelete, onCancel }) => {
  if (!isOpen) {
    return null
  }
  const checkboxFieldName = 'actionACK'

  // bind button disabled state to a form field or ignore it if we are dealing with a remote
  // wallet and don't have confirmation checkbox
  const DeleteWalletButton = withFieldState(checkboxFieldName)(({ fieldState, ...rest }) => (
    <Button disabled={walletDir && !fieldState.value} {...rest} />
  ))

  const buttons = (
    <>
      <DeleteWalletButton variant="danger" type="submit">
        <FormattedMessage {...messages.delete_wallet_dialog_delete_text} />
      </DeleteWalletButton>
      <Button variant="secondary" type="button" onClick={onCancel}>
        <FormattedMessage {...messages.delete_wallet_dialog_cancel_text} />
      </Button>
    </>
  )

  const header = (
    <Flex flexDirection="column" alignItems="center">
      <Delete color="#e8383a" width={72} height={72} />
      <Heading.h1 mt={4} mb={3}>
        <FormattedMessage {...messages.delete_wallet_dialog_header} />
      </Heading.h1>
    </Flex>
  )

  const handleSubmit = () => onDelete()

  return (
    <DialogOverlay justifyContent="center" alignItems="center">
      <Form onSubmit={handleSubmit}>
        <Dialog header={header} buttons={buttons} onClose={onCancel} width={640}>
          {walletDir && (
            <Flex flexDirection="column" alignItems="center">
              <Flex alignItems="flex-start" flexDirection="column">
                <Text mb={2} color="gray" width={550}>
                  <FormattedMessage {...messages.delete_wallet_dialog_warning} />
                </Text>

                <Text color="gray">{walletDir}</Text>
              </Flex>
              <Checkbox
                label={intl.formatMessage({ ...messages.delete_wallet_dialog_acknowledgement })}
                field={checkboxFieldName}
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
  isOpen: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  walletDir: PropTypes.string,
  intl: intlShape.isRequired
}

export default injectIntl(DialogWrapper)
