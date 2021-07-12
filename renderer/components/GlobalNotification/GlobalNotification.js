import React from 'react'

import PropTypes from 'prop-types'
import { animated, Transition } from 'react-spring/renderprops.cjs'
import { Box } from 'rebass/styled-components'
import styled from 'styled-components'

import errorToUserFriendly from '@zap/utils/userFriendlyErrors'
import { Notification } from 'components/UI'

const Wrapper = styled(Box)`
  position: absolute;
  right: 0;
  left: 0;
  z-index: 99999;
`

class GlobalNotification extends React.Component {
  static propTypes = {
    notifications: PropTypes.array,
    removeNotification: PropTypes.func.isRequired,
  }

  render() {
    const { notifications, removeNotification } = this.props

    const prepareMessage = (message, variant) => {
      switch (variant) {
        case 'error':
          return errorToUserFriendly(message)
        default:
          return message
      }
    }

    return (
      <Wrapper mt="22px" mx="auto" px={3} width={0.9}>
        {notifications.map(item => (
          <Transition
            enter={{ opacity: 1 }}
            from={{ opacity: 0 }}
            items={item}
            key={item.id}
            leave={{ opacity: 0 }}
            native
          >
            {show =>
              show &&
              (springStyles => (
                <animated.div style={springStyles}>
                  <Notification
                    isProcessing={item.isProcessing}
                    mb={2}
                    onClick={() => removeNotification(item.id)}
                    variant={item.variant}
                  >
                    {prepareMessage(item.message, item.variant)}
                  </Notification>
                </animated.div>
              ))
            }
          </Transition>
        ))}
      </Wrapper>
    )
  }
}

export default GlobalNotification
