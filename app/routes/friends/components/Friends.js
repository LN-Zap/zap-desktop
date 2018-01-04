import { shell } from 'electron'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Isvg from 'react-inlinesvg'
import { MdSearch } from 'react-icons/lib/md'
import { FaCircle } from 'react-icons/lib/fa'

import { btc } from 'utils'

import FriendsForm from 'components/Friends/FriendsForm'
import OnlineContact from 'components/Friends/OnlineContact'
import PendingContact from 'components/Friends/PendingContact'
import ClosingContact from 'components/Friends/ClosingContact'
import OfflineContact from 'components/Friends/OfflineContact'

import plus from 'icons/plus.svg'

import styles from './Friends.scss'

class Friends extends Component {
  componentWillMount() {
    const { fetchChannels, fetchPeers, fetchDescribeNetwork } = this.props

    fetchChannels()
    fetchPeers()
    fetchDescribeNetwork()
  }

  render() {
    const {
      channels,
      currentChannels,
      activeChannels,
      nonActiveChannels,
      pendingOpenChannels,
      closingPendingChannels,

      openFriendsForm,

      friendsFormProps,

      peers
    } = this.props

    return (
      <div className={styles.friendsContainer}>
        <FriendsForm {...friendsFormProps} />

        <header className={styles.header}>
          <div className={styles.titleContainer}>
            <div className={styles.left}>
              <h1>Contacts <span>({activeChannels.length} online)</span></h1>
            </div>
          </div>
          <div className={styles.newFriendContainer}>
            <div className={`buttonPrimary ${styles.newFriendButton}`} onClick={openFriendsForm}>
              <Isvg src={plus} />
              <span>Add</span>
            </div>
          </div>
        </header>

        <div className={styles.search}>
          <label className={`${styles.label} ${styles.input}`} htmlFor='channelSearch'>
            <MdSearch />
          </label>
          <input
            value={''}
            onChange={event => console.log('event: ', event)}
            className={`${styles.text} ${styles.input}`}
            placeholder='Search your friends list...'
            type='text'
            id='channelSearch'
          />
        </div>

        <ul className={styles.friends}>
          {
            currentChannels.length > 0 && currentChannels.map(channel => {
              console.log('channel: ', channel)

              if (channel.active) {
                return <OnlineContact channel={channel} />
              } else if (!channel.active) {
                return <OfflineContact channel={channel} />
              } else if (Object.prototype.hasOwnProperty.call(channel, 'blocks_till_open')) {
                return <PendingContact channel={channel} />
              } else if (Object.prototype.hasOwnProperty.call(channel, 'closing_txid')) {
                return <ClosingContact channel={channel} />
              }
            })
          }
        </ul>
      </div>
    )
  }
}

Friends.propTypes = {}

export default Friends
