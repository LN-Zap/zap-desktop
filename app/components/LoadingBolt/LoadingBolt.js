import React from 'react'
import PropTypes from 'prop-types'
import { Transition, animated } from 'react-spring'
import CloudLightning from 'components/Icon/CloudLightning'

import { FormattedMessage } from 'react-intl'
import messages from './messages'

import styles from './LoadingBolt.scss'

class LoadingBolt extends React.Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    theme: PropTypes.object.isRequired
  }

  render() {
    const { theme, isLoading = true } = this.props

    return (
      <div>
        <Transition enter={{ opacity: 1 }} leave={{ opacity: 0 }} native>
          {isLoading &&
            (springStyles => (
              <animated.div style={springStyles} className={`${styles.container} ${theme.name}`}>
                <div className={styles.content}>
                  <CloudLightning height="155px" width="150px" />
                  <h1>
                    <FormattedMessage {...messages.loading} />
                  </h1>
                </div>
              </animated.div>
            ))}
        </Transition>
      </div>
    )
  }
}

export default LoadingBolt
