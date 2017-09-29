import React from 'react';
import { shallow } from 'enzyme'

import Channels from '../../app/components/Channels'
import ChannelModal from '../../app/components/Channels/ChannelModal'
import ChannelForm from '../../app/components/Channels/ChannelForm'
import Channel from '../../app/components/Channels/Channel'
import OpenPendingChannel from '../../app/components/Channels/OpenPendingChannel'
import ClosedPendingChannel from '../../app/components/Channels/ClosedPendingChannel'

const defaultProps = {
  ticker: {},
  peers: [],
  channelsLoading: false,
  modalChannel: {},
  setChannel: () => {},
  channelModalOpen: false,
  channelForm: {},
  setChannelForm: () => {},
  allChannels: [],
  openChannel: () => {},
  closeChannel: () => {},
  currentTicker: {},
  explorerLinkBase: 'https://testnet.smartbit.com.au'
}

const channel_open = {
  active: true,
  capacity: '10000000',
  chan_id: '1322138543153545216',
  channel_point: '7efb80bf568cf55eb43ba439fdafea99b43f53493ec9ae7c0eae88de2d2b4577:0',
  commit_fee: '8688',
  commit_weight: '600',
  fee_per_kw: '12000',
  local_balance: '9991312',
  num_updates: '0',
  pending_htlcs: [],
  remote_balance: '0',
  remote_pubkey: '020178567c0f881b579a7ddbcd8ce362a33ebba2b3c2d218e667f7e3b390e40d4e',
  total_satoshis_received: '0',
  total_satoshis_sent: '0',
  unsettled_balance: '0'
}

const channel_pending = {
  capacity: '10000000',
  channel_point: '7efb80bf568cf55eb43ba439fdafea99b43f53493ec9ae7c0eae88de2d2b4577:0',
  local_balance: '9991312',
  remote_balance: '0',
  remote_node_pub: '020178567c0f881b579a7ddbcd8ce362a33ebba2b3c2d218e667f7e3b390e40d4e'
}

const pending_open_channels = {
  blocks_till_open: 0,
  channel: channel_pending,
  commit_fee: '8688',
  commit_weight: '600',
  confirmation_height: 0,
  fee_per_kw: '12000'
}

const pending_closing_channels = {
  channel: channel_pending,
  closing_txid: '8d623d1ddd32945cace3351d511df2b5be3e0f7c7e5622989d2fc0215e8a2a7e'
}

describe('Channels', () => {
  describe('should show default components', () => {
    const props = { ...defaultProps, channelsLoading: true }
    const el = shallow(<Channels {...props} />)
    it('should contain Modal and Form', () => {
      expect(el.find(ChannelModal)).toHaveLength(1)
      expect(el.find(ChannelForm)).toHaveLength(1)
    })
  })

  describe('channels are loading', () => {
    const props = { ...defaultProps, channelsLoading: true }
    const el = shallow(<Channels {...props} />)
    it('should display loading msg', () => {
      expect(el.contains('Loading...')).toBe(true)
    })
  })

  describe('channels are loaded', () => {
    describe('no channels', () => {
      const props = { ...defaultProps, allChannels: [] }
      const el = shallow(<Channels {...props} />)
      it('should not show channels or loading', () => {
        expect(el.contains('Loading...')).toBe(false)
        expect(el.find(Channel)).toHaveLength(0)
      })
    })

    describe('channel is open-pending', () => {
      const props = { ...defaultProps, allChannels: [pending_open_channels] }
      const el = shallow(<Channels {...props} />)
      it('should display open-pending', () => {
        expect(el.find(OpenPendingChannel)).toHaveLength(1)
      })
    })

    describe('channel is open', () => {
      const props = { ...defaultProps, allChannels: [channel_open] }
      const el = shallow(<Channels {...props} />)
      it('should display open channel', () => {
        expect(el.find(Channel)).toHaveLength(1)
      })
    })

    describe('channel is closed-pending', () => {
      const props = { ...defaultProps, allChannels: [pending_closing_channels] }
      const el = shallow(<Channels {...props} />)
      it('should display closed-pending', () => {
        expect(el.find(ClosedPendingChannel)).toHaveLength(1)
      })
    })
  })
})
