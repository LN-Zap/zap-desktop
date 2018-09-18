import React from 'react'
import PropTypes from 'prop-types'
import Isvg from 'react-inlinesvg'

import cloudLightningIcon from 'icons/cloud_lightning.svg'

import { FormattedMessage } from 'react-intl'
import messages from './messages'

import styles from './LoadingBolt.scss'

const LoadingBolt = ({ theme }) => (
  <div className={`${styles.container} ${theme}`}>
    <div className={styles.content}>
      <Isvg className={styles.bolt} src={cloudLightningIcon} />
      <h1>
        <FormattedMessage {...messages.loading} />
      </h1>
    </div>
  </div>
)

LoadingBolt.propTypes = {
  theme: PropTypes.string.isRequired
}

export default LoadingBolt
