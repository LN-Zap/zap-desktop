import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Spring, animated, Transition } from 'react-spring/renderprops.cjs'
import { Flex } from 'rebass'
import { Bar, Heading, Button, Form, Panel } from 'components/UI'
import AutopayCreateSuccess from './AutopayCreateSuccess'
import AutopayCreateSettings from './AutopayCreateSettings'
import messages from './messages'

const { min, max, defaultValue } = CONFIG.autopay

const Container = styled(animated.div)`
  position: absolute;
  transform-origin: 50% 100px;
  left: 50%;
  width: 100%;
`

const AutopayCreateForm = props => {
  const {
    merchantNickname,
    merchantName,
    pubkey,
    isActive,
    merchantLogo,
    onCreateAutopay,
    onClose,
    showError,
    intl,
    showNotification,
    ...rest
  } = props

  const onSubmit = async values => {
    try {
      const { limit } = values
      await onCreateAutopay(pubkey, parseFloat(limit))
      const message = intl.formatMessage({ ...messages.add_success })
      showNotification(message)
    } catch (e) {
      const message = intl.formatMessage({ ...messages.add_error })
      showError(message)
    }
  }

  const hide = { opacity: 0 }
  const show = { opacity: 1 }
  return (
    <Form {...rest} onSubmit={onSubmit}>
      {({ formState }) => {
        const { limit = min } = formState.values
        const back = <AutopayCreateSuccess merchantLogo={merchantLogo} />
        const front = (
          <AutopayCreateSettings
            defaultValue={defaultValue}
            limit={limit}
            max={max}
            merchantName={merchantName}
            min={min}
            pubkey={pubkey}
          />
        )

        /* eslint-disable  react/display-name */
        /* eslint-disable   react/prop-types */

        const renderFlipper = isActive => ({ opacity }) => (
          <Container
            style={{
              transform: `rotateX(${isActive ? 180 : 0}deg)`,
              opacity: opacity.interpolate({
                range: [0, 0.5, 1],
                output: [0, 0, 1],
              }),
            }}
          >
            {isActive ? back : front}
          </Container>
        )
        /* eslint-disable */
        return (
          <Panel px={5}>
            <Panel.Header>
              <Heading.h1 textAlign="center">
                <FormattedMessage
                  values={{ merchantNickname }}
                  {...(isActive ? messages.header_success : messages.header_add)}
                />
              </Heading.h1>
              <Bar my={2} />
            </Panel.Header>
            <Panel.Body css={{ height: '195px' }}>
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
            </Panel.Body>
            <Panel.Footer mt={3}>
              <Flex justifyContent="center">
                <Button
                  onClick={() => isActive && onClose()}
                  type={isActive ? 'button' : 'submit'}
                  variant="primary"
                >
                  <FormattedMessage
                    {...(isActive ? messages.close_button_text : messages.add_button_text)}
                  />
                </Button>
              </Flex>
            </Panel.Footer>
          </Panel>
        )
      }}
    </Form>
  )
}

AutopayCreateForm.propTypes = {
  isActive: PropTypes.bool.isRequired,
  merchantLogo: PropTypes.string.isRequired,
  merchantName: PropTypes.string.isRequired,
  merchantNickname: PropTypes.string.isRequired,
  showNotification: PropTypes.func.isRequired,
  showError: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreateAutopay: PropTypes.func.isRequired,
  pubkey: PropTypes.string.isRequired,
}

export default injectIntl(AutopayCreateForm)
