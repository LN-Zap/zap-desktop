import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { MdSearch } from 'react-icons/lib/md'
import styles from './Channels.scss'

class Channels extends Component {
  componentWillMount() {
    this.props.fetchChannels()
  }

  render() {
    const {
      channels
    } = this.props

    return (
      <div className={styles.container}>
        <div className={styles.search}>
          <label className={`${styles.label} ${styles.input}`} htmlFor='invoiceSearch'>
            <MdSearch />
          </label>
          <input
            value={''}
            onChange={event => console.log('event: ', event)}
            className={`${styles.text} ${styles.input}`}
            placeholder='Search channels by funding transaction, channel id, remote public key, etc'
            type='text'
            id='invoiceSearch'
          />
        </div>
        channels
      </div>
    )
  }
}

Channels.propTypes = {
  
}

export default Channels
