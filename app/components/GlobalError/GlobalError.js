import React from 'react'
import PropTypes from 'prop-types'
import { animated, Transition } from 'react-spring'
import { Box } from 'rebass'
import errorToUserFriendly from 'lib/utils/userFriendlyErrors'
import Notification from 'components/UI/Notification'

class GlobalError extends React.Component {
  static propTypes = {
    error: PropTypes.string,
    clearError: PropTypes.func.isRequired
  }

  componentDidUpdate(prevProps) {
    const { clearError, error } = this.props
    if (!prevProps.error && error) {
      setTimeout(clearError, 10000)
    }
  }

  render() {
    const { error, clearError } = this.props

    return (
      <Transition
        native
        items={error}
        from={{ opacity: 0 }}
        enter={{ opacity: 1 }}
        leave={{ opacity: 0 }}
      >
        {show =>
          show &&
          (springStyles => (
            <Box mt="22px" px={3} width={1} css={{ position: 'absolute', 'z-index': 100 }}>
              <animated.div style={springStyles}>
                <Notification variant="error" onClick={clearError}>
                  {errorToUserFriendly(error)}
                </Notification>
              </animated.div>
            </Box>
          ))
        }
      </Transition>
    )
  }
}

export default GlobalError
