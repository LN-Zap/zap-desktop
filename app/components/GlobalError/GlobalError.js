import React from 'react'
import PropTypes from 'prop-types'
import { animated, Transition } from 'react-spring'
import { Box } from 'rebass'
import errorToUserFriendly from 'lib/utils/userFriendlyErrors'
import { Notification } from 'components/UI'

class GlobalError extends React.Component {
  static propTypes = {
    errors: PropTypes.array,
    clearError: PropTypes.func.isRequired
  }

  render() {
    const { errors, clearError } = this.props

    return (
      <Box mt="22px" px={3} width={1} css={{ position: 'absolute', 'z-index': '99999' }}>
        {errors.map(item => (
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
                  <Notification variant="error" onClick={() => clearError(item.id)} mb={2}>
                    {errorToUserFriendly(item.message)}
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

export default GlobalError
