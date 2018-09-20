import React from 'react'
import PropTypes from 'prop-types'
import Isvg from 'react-inlinesvg'
import { Transition, animated, config } from 'react-spring'
import cloudLightningIcon from 'icons/cloud_lightning.svg'

import { FormattedMessage } from 'react-intl'
import messages from './messages'

import styles from './LoadingBolt.scss'

class LoadingBolt extends React.PureComponent {
  render() {
    const { theme, visible = true } = this.props
    return (
      <div>
        <Transition enter={{ opacity: 1 }} leave={{ opacity: 0 }} config={config.slow} native>
          {visible &&
            (springStyles => (
              <animated.div style={springStyles} className={`${styles.container} ${theme}`}>
                <div className={styles.content}>
                  <Isvg className={styles.bolt} src={cloudLightningIcon} />
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

LoadingBolt.propTypes = {
  visible: PropTypes.bool,
  theme: PropTypes.string.isRequired
}

export default LoadingBolt
