import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import messages from './messages'
import styles from './ConnectionConfirm.scss'

const ConnectionConfirm = ({ connectionHost }) => (
  <div className={styles.container}>
    <h2>
      <FormattedMessage {...messages.verify_host_title} />{' '}
      <span className={styles.host}>{connectionHost.split(':')[0]}</span>?{' '}
    </h2>
    <p>
      <FormattedMessage {...messages.verify_host_description} />
    </p>
  </div>
)

ConnectionConfirm.propTypes = {
  connectionHost: PropTypes.string.isRequired
}

export default ConnectionConfirm
