import React from 'react'
import PropTypes from 'prop-types'
import { animated, Transition } from 'react-spring'
import CloudLightning from 'components/Icon/CloudLightning'
import { FormattedMessage } from 'react-intl'
import messages from './messages'
import styles from './LoadingBolt.scss'

class LoadingBolt extends React.PureComponent {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    theme: PropTypes.object.isRequired
  }

  render() {
    const { theme, isLoading } = this.props

    return (
      <Transition
        native
        items={isLoading}
        from={{ opacity: 1 }}
        enter={{ opacity: 1 }}
        leave={{ opacity: 0 }}
      >
        {show =>
          show &&
          (springStyles => (
            <animated.div style={springStyles} className={`${styles.container} ${theme.name}`}>
              <div className={styles.content}>
                <CloudLightning height="155px" width="150px" />
                <h1>
                  <FormattedMessage {...messages.loading} />
                </h1>
              </div>
            </animated.div>
          ))
        }
      </Transition>
    )
  }
}

export default LoadingBolt
