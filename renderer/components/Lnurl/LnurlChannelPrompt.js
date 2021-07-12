import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex } from 'rebass/styled-components'

import { Form } from 'components/Form'
import { Dialog, Heading, Button, DialogOverlay, Text } from 'components/UI'

import messages from './messages'

const LnurlChannelPrompt = ({ params, onOk, onCancel, onClose }) => {
  const { service } = params
  const buttons = (
    <>
      <Button type="submit" variant="normal">
        <FormattedMessage {...messages.lnurl_channel_prompt_dialog_confirm_text} />
      </Button>
      <Button onClick={onCancel} type="button" variant="secondary">
        <FormattedMessage {...messages.lnurl_channel_prompt_dialog_decline_text} />
      </Button>
    </>
  )

  const header = (
    <Flex alignItems="center" flexDirection="column" mb={4}>
      <Heading.H1>
        <FormattedMessage {...messages.lnurl_channel_prompt_dialog_header} />
      </Heading.H1>
    </Flex>
  )

  const handleSubmit = values => onOk(values)

  return (
    <DialogOverlay alignItems="center" justifyContent="center">
      <Form onSubmit={handleSubmit}>
        <Dialog buttons={buttons} header={header} onClose={onClose} width={640}>
          <Text color="gray">
            <FormattedMessage values={{ service }} {...messages.lnurl_channel_prompt_dialog_body} />
          </Text>
        </Dialog>
      </Form>
    </DialogOverlay>
  )
}

LnurlChannelPrompt.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
}

export default LnurlChannelPrompt
