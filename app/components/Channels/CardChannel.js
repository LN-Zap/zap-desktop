import React from 'react'
import PropTypes from 'prop-types'
import styles from './CardChannel.scss'

const CardChannel = ({ channel }) => (
  <li className={styles.channel}>
    {channel.chan_id}
  </li>
)

CardChannel.propTypes = {
  channel: PropTypes.object.isRequired
}

export default CardChannel
