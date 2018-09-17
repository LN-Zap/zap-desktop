import React from 'react'
import Isvg from 'react-inlinesvg'

import cloudboltIcon from 'icons/cloudbolt.svg'

import { FormattedMessage } from 'react-intl'
import messages from './messages'

import styles from './LoadingBolt.scss'

const LoadingBolt = () => (
  <div className={styles.container}>
    <div className={styles.content}>
      <Isvg className={styles.bolt} src={cloudboltIcon} />
      <h1>
        <FormattedMessage {...messages.loading} />
      </h1>
    </div>
  </div>
)

export default LoadingBolt
