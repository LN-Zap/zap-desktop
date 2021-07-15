import React from 'react'

import { withFieldState } from 'informed'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Flex, Box } from 'rebass/styled-components'

import { intlShape } from '@zap/i18n'
import { Checkbox, Form, TransactionFeeInput } from 'components/Form'
import Delete from 'components/Icon/Delete'
import { Dialog, Text, Heading, Button, DialogOverlay } from 'components/UI'

import {
  TRANSACTION_SPEED_SLOW,
  TRANSACTION_SPEED_MEDIUM,
  TRANSACTION_SPEED_FAST,
} from './constants'
import messages from './messages'

const DialogWrapper = ({
  intl,
  isForceClose,
  isOpen,
  lndTargetConfirmations,
  onClose,
  onCancel,
  csvDelay,
}) => {
  if (!isOpen) {
    return null
  }
  const checkboxFieldName = 'actionACK'
  // bind button disabled state to a form field
  const CloseChannelButton = withFieldState(checkboxFieldName)(({ fieldState, ...rest }) => (
    <Button isDisabled={isForceClose && !fieldState.value} {...rest} />
  ))

  const buttons = (
    <>
      <CloseChannelButton type="submit" variant="danger">
        <FormattedMessage
          {...(isForceClose
            ? messages.close_channel_dialog_force_close_text
            : messages.close_channel_dialog_close_text)}
        />
      </CloseChannelButton>
      <Button onClick={onCancel} type="button" variant="secondary">
        <FormattedMessage {...messages.close_channel_dialog_cancel_text} />
      </Button>
    </>
  )

  const header = (
    <Flex alignItems="center" flexDirection="column" mb={4}>
      <Box color="superRed" mb={2}>
        <Delete height={72} width={72} />
      </Box>
      <Heading.H1 textAlign="center">
        <FormattedMessage {...messages.close_channel_dialog_header} />
      </Heading.H1>
    </Flex>
  )

  const handleSubmit = ({ speed }) => {
    const speedMap = {
      [TRANSACTION_SPEED_SLOW]: 'slow',
      [TRANSACTION_SPEED_MEDIUM]: 'medium',
      [TRANSACTION_SPEED_FAST]: 'fast',
    }
    const speedKey = speedMap[speed]
    const targetConf = lndTargetConfirmations[speedKey]
    onClose(targetConf, intl.formatMessage({ ...messages.close_channel_notification }))
  }

  return (
    <DialogOverlay alignItems="center" justifyContent="center">
      <Form onSubmit={handleSubmit}>
        <Dialog buttons={buttons} header={header} onClose={onCancel} width={640}>
          <Flex alignItems="center" flexDirection="column">
            <Text color="gray" mb={2} textAlign={isForceClose ? 'left' : 'center'}>
              <FormattedMessage
                {...(isForceClose
                  ? messages.close_channel_dialog_force_warning
                  : messages.close_channel_dialog_warning)}
                values={{ csvDelay }}
              />
            </Text>
            <TransactionFeeInput
              field="speed"
              hasFee={false}
              isQueryingFees={false}
              label={intl.formatMessage({ ...messages.fee })}
              lndTargetConfirmations={lndTargetConfirmations}
              required
            />
            {isForceClose && (
              <Checkbox
                field={checkboxFieldName}
                label={intl.formatMessage({ ...messages.close_channel_dialog_acknowledgement })}
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
  csvDelay: PropTypes.number.isRequired,
  intl: intlShape.isRequired,
  isForceClose: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  lndTargetConfirmations: PropTypes.shape({
    fast: PropTypes.number.isRequired,
    medium: PropTypes.number.isRequired,
    slow: PropTypes.number.isRequired,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default injectIntl(DialogWrapper)
