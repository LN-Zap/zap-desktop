import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Isvg from 'react-inlinesvg'
import { MdSearch } from 'react-icons/lib/md'
import { FaAngleDown, FaRepeat } from 'react-icons/lib/fa'

import { btc } from 'utils'

import ContactModal from 'components/Contacts/ContactModal'
import ContactsForm from 'components/Contacts/ContactsForm'
import OnlineContact from 'components/Contacts/OnlineContact'
import PendingContact from 'components/Contacts/PendingContact'
import ClosingContact from 'components/Contacts/ClosingContact'
import OfflineContact from 'components/Contacts/OfflineContact'
import LoadingContact from 'components/Contacts/LoadingContact'

import plus from 'icons/plus.svg'

import styles from './Contacts.scss'

class Contacts extends Component {
  constructor(props) {
    super(props)

    this.state = {
      refreshing: false
    }
  }

  componentWillMount() {
    const { fetchChannels, fetchPeers, fetchDescribeNetwork } = this.props

    fetchChannels()
    fetchPeers()
    fetchDescribeNetwork()
  }

  render() {
    const {
      channels: {
        searchQuery,
        filterPulldown,
        filter,
        viewType,
        loadingChannelPubkeys,
        closingChannelIds
      },
      currentChannels,
      activeChannels,
      nonActiveChannels,
      pendingOpenChannels,
      closingPendingChannels,
      fetchChannels,
      updateChannelSearchQuery,

      toggleFilterPulldown,
      changeFilter,
      nonActiveFilters,
      
      openContactsForm,
      openContactModal,
      closeContactModal,

      contactModalProps,
      contactsFormProps,

      peers
    } = this.props

    const refreshClicked = () => {
      // turn the spinner on
      this.setState({ refreshing: true })

      // store event in icon so we dont get an error when react clears it
      const icon = this.repeat.childNodes

      // fetch channels
      fetchChannels()

      // wait for the svg to appear as child
      const svgTimeout = setTimeout(() => {
        if (icon[0].tagName === 'svg') {
          // spin icon for 1 sec
          icon[0].style.animation = 'spin 1000ms linear 1'
          clearTimeout(svgTimeout)
        }
      }, 1)

      // clear animation after the second so we can reuse it
      const refreshTimeout = setTimeout(() => {
        icon[0].style.animation = ''
        this.setState({ refreshing: false })
        clearTimeout(refreshTimeout)
      }, 1000)
    }

    return (
      <div className={styles.friendsContainer}>
        <ContactModal {...contactModalProps} />
        <ContactsForm {...contactsFormProps} />

        <header className={styles.header}>
          <div className={styles.titleContainer}>
            <div className={styles.left}>
              <h1>Contacts <span>({activeChannels.length} online)</span></h1>
            </div>
          </div>
          <div className={styles.newFriendContainer}>
            <div className={`buttonPrimary ${styles.newFriendButton}`} onClick={openContactsForm}>
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
            value={searchQuery}
            onChange={event => updateChannelSearchQuery(event.target.value)}
            className={`${styles.text} ${styles.input}`}
            placeholder='Search your contacts list...'
            type='text'
            id='channelSearch'
          />
        </div>

        <div className={styles.filtersContainer}>
          <section>
            <h2 onClick={toggleFilterPulldown} className={styles.filterTitle}>
              {filter.name} <span className={filterPulldown && styles.pulldown}><FaAngleDown /></span>
            </h2>
            <ul className={`${styles.filters} ${filterPulldown && styles.active}`}>
              {
                nonActiveFilters.map(f => (
                  <li key={f.key} onClick={() => changeFilter(f)}>
                    {f.name}
                  </li>
                ))
              }
            </ul>
          </section>
          <section className={styles.refreshContainer}>
            <span className={styles.refresh} onClick={refreshClicked} ref={(ref) => { this.repeat = ref }}>
              {
                this.state.refreshing ?
                  <FaRepeat />
                  :
                  'Refresh'
              }
            </span>
          </section>
        </div>

        <ul className={`${styles.friends} ${filterPulldown && styles.fade}`}>
          {
            loadingChannelPubkeys.map(pubkey => <LoadingContact pubkey={pubkey} isClosing={false} />)
          }

          {
            currentChannels.length > 0 && currentChannels.map((channel, index) => {
              if (closingChannelIds.includes(channel.chan_id)) {
                return <LoadingContact pubkey={channel.remote_pubkey} isClosing={true} />
              } else if (Object.prototype.hasOwnProperty.call(channel, 'blocks_till_open')) {
                return <PendingContact channel={channel} key={index} />
              } else if (Object.prototype.hasOwnProperty.call(channel, 'closing_txid')) {
                return <ClosingContact channel={channel} key={index} />
              } else if (channel.active) {
                return <OnlineContact channel={channel} key={index} openContactModal={openContactModal} />
              } else if (!channel.active) {
                return <OfflineContact channel={channel} key={index} openContactModal={openContactModal} />
              }
            })
          }
        </ul>
      </div>
    )
  }
}

Contacts.propTypes = {}

export default Contacts
