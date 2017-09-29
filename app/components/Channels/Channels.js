import React from 'react'
import PropTypes from 'prop-types'
import { TiPlus } from 'react-icons/lib/ti'
import ChannelModal from './ChannelModal'
import ChannelForm from './ChannelForm'
import Channel from './Channel'
import OpenPendingChannel from './OpenPendingChannel'
import ClosedPendingChannel from './ClosedPendingChannel'
import styles from './Channels.scss'

const Channels = ({
  ticker,
  peers,
  channelsLoading,
  modalChannel,
  setChannel,
  channelModalOpen,
  channelForm,
  setChannelForm,
  allChannels,
  openChannel,
  closeChannel,
  currentTicker,
  explorerLinkBase
}) => (
  <div className={styles.channels}>
    <ChannelModal
      isOpen={channelModalOpen}
      resetChannel={setChannel}
      channel={modalChannel}
      explorerLinkBase={explorerLinkBase}
      closeChannel={closeChannel}
    />
    <ChannelForm form={channelForm} setForm={setChannelForm} ticker={ticker} peers={peers} openChannel={openChannel} currentTicker={currentTicker} />
    <div className={styles.header}>
      <h3>Channels</h3>
      <div
        className={`${styles.openChannel} hint--top`}
        data-hint='Open a channel'
        onClick={() => setChannelForm({ isOpen: true })}
      >
        <TiPlus />
      </div>
    </div>
    <ul>
      {
        !channelsLoading ?
          allChannels.map((channel, index) => {
            if (Object.prototype.hasOwnProperty.call(channel, 'blocks_till_open')) {
              return (
                <OpenPendingChannel
                  key={index}
                  channel={channel}
                  ticker={ticker}
                  currentTicker={currentTicker}
                  explorerLinkBase={explorerLinkBase}
                />
              )
            } else if (Object.prototype.hasOwnProperty.call(channel, 'closing_txid')) {
              return (
                <ClosedPendingChannel
                  key={index}
                  channel={channel}
                  ticker={ticker}
                  currentTicker={currentTicker}
                  explorerLinkBase={explorerLinkBase}
                />
              )
            }
            return (
              <Channel
                key={channel.chan_id}
                ticker={ticker}
                channel={channel}
                setChannel={setChannel}
                currentTicker={currentTicker}
              />
            )
          })
          :
          'Loading...'
      }
    </ul>
  </div>
)

Channels.propTypes = {
  ticker: PropTypes.object.isRequired,
  peers: PropTypes.array.isRequired,
  channelsLoading: PropTypes.bool.isRequired,
  modalChannel: PropTypes.object,
  setChannel: PropTypes.func.isRequired,
  channelModalOpen: PropTypes.bool.isRequired,
  channelForm: PropTypes.object.isRequired,
  setChannelForm: PropTypes.func.isRequired,
  allChannels: PropTypes.array.isRequired,
  openChannel: PropTypes.func.isRequired,
  closeChannel: PropTypes.func.isRequired,
  currentTicker: PropTypes.object.isRequired,
  explorerLinkBase: PropTypes.string.isRequired
}

export default Channels
