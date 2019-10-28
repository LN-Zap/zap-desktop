import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass/styled-components'
import { FormattedMessage } from 'react-intl'
import { Dialog, Heading, Button, DialogOverlay, Text } from 'components/UI'
import { Form } from 'components/Form'
import messages from './messages'

const DialogWrapper = ({ params, onOk, onCancel }) => {
  const { service, amount } = params
  const buttons = (
    <>
      <Button type="submit" variant="normal">
        <FormattedMessage {...messages.withdrawal_prompt_dialog_confirm_text} />
      </Button>
      <Button onClick={onCancel} type="button" variant="secondary">
        <FormattedMessage {...messages.withdrawal_prompt_dialog_decline_text} />
      </Button>
    </>
  )

  const header = (
    <Flex alignItems="center" flexDirection="column" mb={4}>
      <Heading.h1>
        <FormattedMessage {...messages.withdrawal_prompt_dialog_header} />
      </Heading.h1>
    </Flex>
  )

  const handleSubmit = values => onOk(values)

  return (
    <DialogOverlay alignItems="center" justifyContent="center">
      <Form onSubmit={handleSubmit}>
        <Dialog buttons={buttons} header={header} onClose={onCancel} width={640}>
          <Text color="gray">
            <FormattedMessage
              values={{ amount: amount / 1000 }}
              {...messages.withdrawal_prompt_dialog_body}
            />
          </Text>
          <Text>{service}</Text>
        </Dialog>
      </Form>
    </DialogOverlay>
  )
}

DialogWrapper.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
}

export default DialogWrapper
