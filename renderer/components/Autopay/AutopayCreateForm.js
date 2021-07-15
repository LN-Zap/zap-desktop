import React from 'react'

import config from 'config'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Spring, animated, Transition } from 'react-spring/renderprops.cjs'
import { Box, Flex } from 'rebass/styled-components'
import styled from 'styled-components'

import { intlShape } from '@zap/i18n'
import { Form } from 'components/Form'
import { Bar, Heading, Button } from 'components/UI'

import AutopayCreateSettings from './AutopayCreateSettings'
import AutopayCreateSuccess from './AutopayCreateSuccess'
import messages from './messages'

const { min, max, defaultValue } = config.autopay

const Container = styled(animated.div)`
  position: absolute;
  transform-origin: 50% 100px;
  left: 50%;
  width: 100%;
`

const getButtonText = (isActive, isEditMode) => {
  if (isEditMode) {
    return messages.edit_button_text
  }

  return isActive ? messages.close_button_text : messages.add_button_text
}

const AutopayCreateForm = props => {
  const {
    merchantNickname,
    merchantName,
    pubkey,
    isActive,
    limit = defaultValue,
    merchantLogo,
    onRemoveAutopay,
    onCreateAutopay,
    onClose,
    showError,
    intl,
    isEditMode,
    showNotification,
    ...rest
  } = props
  const onSubmit = async values => {
    try {
      if (isEditMode) {
        const { limit, isEnabled } = values
        if (isEnabled) {
          await onCreateAutopay(pubkey, limit)
          const message = intl.formatMessage({ ...messages.save_success })
          onClose()
          showNotification(message)
        } else {
          onRemoveAutopay(pubkey)
          const message = intl.formatMessage({ ...messages.remove_success })
          onClose()
          showNotification(message)
        }
      } else {
        const { limit } = values
        await onCreateAutopay(pubkey, limit)
        const message = intl.formatMessage({ ...messages.add_success })
        showNotification(message)
      }
    } catch (e) {
      const message = intl.formatMessage({ ...messages.add_error })
      showError(message)
    }
  }

  // new autopay entry has just been added
  const isNewItemAdded = isActive && !isEditMode
  const hide = { opacity: 0 }
  const show = { opacity: 1 }

  return (
    <Form {...rest} onSubmit={onSubmit}>
      {({ formState }) => {
        const back = <AutopayCreateSuccess merchantLogo={merchantLogo} />
        const front = (
          <AutopayCreateSettings
            defaultValue={limit || defaultValue}
            isEditMode={isEditMode}
            limit={formState.values.limit}
            max={max}
            merchantName={merchantName}
            min={min}
            pubkey={pubkey}
          />
        )

        /* eslint-disable  react/display-name */
        /* eslint-disable   react/prop-types */
        const renderFlipper = isFlipperActive => ({ opacity }) => (
          <Container
            style={{
              transform: `rotateX(${isFlipperActive ? 180 : 0}deg)`,
              opacity: opacity.interpolate({
                range: [0, 0.5, 1],
                output: [0, 0, 1],
              }),
            }}
          >
            {isNewItemAdded ? back : front}
          </Container>
        )
        /* eslint-disable */
        return (
          <Box px={5}>
            <Heading.H1 textAlign="center">
              <FormattedMessage
                values={{ merchantNickname }}
                {...(isActive ? messages.header_success : messages.header_add)}
              />
            </Heading.H1>
            <Bar my={2} />
            <Box height={isEditMode ? 250 : 195}>
              <Spring
                native
                to={{
                  transformOrigin: '50% 100px',
                  transform: `rotateX(${isActive ? 180 : 0}deg)`,
                }}
              >
                {props => (
                  <animated.div style={props}>
                    <Transition
                      enter={show}
                      from={hide}
                      items={isActive}
                      leave={hide}
                      native
                      unique
                    >
                      {renderFlipper}
                    </Transition>
                  </animated.div>
                )}
              </Spring>
            </Box>
            <Flex justifyContent="center" mt={3}>
              <Button
                onClick={() => isNewItemAdded && onClose()}
                type={isNewItemAdded ? 'button' : 'submit'}
                variant="primary"
              >
                <FormattedMessage {...getButtonText(isActive, isEditMode)} />
              </Button>
            </Flex>
          </Box>
        )
      }}
    </Form>
  )
}

AutopayCreateForm.propTypes = {
  isActive: PropTypes.bool.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  limit: PropTypes.string,
  merchantLogo: PropTypes.string.isRequired,
  merchantName: PropTypes.string.isRequired,
  merchantNickname: PropTypes.string.isRequired,
  showNotification: PropTypes.func.isRequired,
  showError: PropTypes.func.isRequired,
  onRemoveAutopay: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreateAutopay: PropTypes.func.isRequired,
  pubkey: PropTypes.string.isRequired,
}

export default injectIntl(AutopayCreateForm)
