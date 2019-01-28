import React from 'react'
import PropTypes from 'prop-types'
import { animated, Transition } from 'react-spring'
import { Box } from 'rebass'
import errorToUserFriendly from 'lib/utils/userFriendlyErrors'
import { Notification } from 'components/UI'

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
      <Box mt="22px" px={3} width={1} css={{ position: 'absolute', 'z-index': '99999' }}>
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
      </Box>
    )
  }
}

export default GlobalNotification
