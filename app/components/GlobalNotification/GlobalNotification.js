import React from 'react'
import PropTypes from 'prop-types'
import { animated, Transition } from 'react-spring'
import styled from 'styled-components'
import { Box } from 'rebass'
import errorToUserFriendly from 'lib/utils/userFriendlyErrors'
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
    removeNotification: PropTypes.func.isRequired
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
      <Wrapper mt="22px" px={3} width={0.9} mx="auto">
        {notifications.map(item => (
          <Transition
            native
            key={item.id}
            items={item}
            from={{ opacity: 0 }}
            enter={{ opacity: 1 }}
            leave={{ opacity: 0 }}
          >
            {show =>
              show &&
              (springStyles => (
                <animated.div style={springStyles}>
                  <Notification
                    variant={item.variant}
                    onClick={() => removeNotification(item.id)}
                    mb={2}
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
