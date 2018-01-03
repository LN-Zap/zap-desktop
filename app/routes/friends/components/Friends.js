import { shell } from 'electron'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Isvg from 'react-inlinesvg'
import { MdSearch } from 'react-icons/lib/md'
import { FaCircle } from 'react-icons/lib/fa'

import plus from 'icons/plus.svg'

import styles from './Friends.scss'

class Friends extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const { fetchChannels, fetchPeers } = this.props

    fetchChannels()
    fetchPeers()
  }

  render() {
    const {
      channels,
      activeChannels,
      nonActiveChannels,
      pendingOpenChannels,

      peers
    } = this.props

    console.log('pendingOpenChannels: ', pendingOpenChannels)

    return (
      <div className={styles.friendsContainer}>
        <header className={styles.header}>
          <div className={styles.titleContainer}>
            <div className={styles.left}>
              <h1>Friends ({activeChannels.length} online)</h1>
            </div>
          </div>
          <div className={styles.newFriendContainer}>
            <div className={`buttonPrimary ${styles.newFriendButton}`} onClick={() => (console.log('yo'))}>
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
            activeChannels.length > 0 && activeChannels.map(activeChannel => {
              console.log('activeChannel: ', activeChannel)
              return (
                <li className={styles.friend} key={activeChannel.chan_id}>
                  <section className={styles.info}>
                    <p className={styles.online}>
                      <FaCircle style={{ verticalAlign: 'top' }} />
                      <span>Online</span>
                    </p>
                    <h2>{activeChannel.remote_pubkey}</h2>
                  </section>
                  <section>
                    
                  </section>
                </li>
              )
            })
          }
          {
            pendingOpenChannels.length > 0 && pendingOpenChannels.map(pendingOpenChannel => {
              console.log('pendingOpenChannel: ', pendingOpenChannel)
              return (
                <li className={styles.friend} key={pendingOpenChannel.chan_id}>
                  <section className={styles.info}>
                    <p className={styles.pending}>
                      <FaCircle style={{ verticalAlign: 'top' }} />
                      <span>
                        Pending
                        <i onClick={() => shell.openExternal(`${'https://testnet.smartbit.com.au'}/tx/${pendingOpenChannel.channel.channel_point.split(':')[0]}`)}>
                          (~{pendingOpenChannel.blocks_till_open * 10} minutes)
                        </i>
                      </span>
                    </p>
                    <h2>{pendingOpenChannel.channel.remote_node_pub}</h2>
                  </section>
                  <section>
                    
                  </section>
                </li>
              )
            })
          }
          {
            nonActiveChannels.length > 0 && nonActiveChannels.map(nonActiveChannel => {
              console.log('nonActiveChannel: ', nonActiveChannel)
              return (
                <li className={styles.friend} key={nonActiveChannel.chan_id}>
                  <section className={styles.info}>
                    <p>
                      <FaCircle style={{ verticalAlign: 'top' }} />
                      <span>Offline</span>
                    </p>
                    <h2>{nonActiveChannel.remote_pubkey}</h2>
                  </section>
                  <section>
                    
                  </section>
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }
}

Friends.propTypes = {}

export default Friends
