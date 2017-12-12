import React from 'react'
import { shallow } from 'enzyme'

import Peers from '../../app/routes/peers/components/Peers'
import PeerModal from '../../app/components/Peers/PeerModal'
import PeerForm from '../../app/components/Peers/PeerForm'
import Peer from '../../app/components/Peers/Peer'

const defaultProps = {
  fetchPeers: () => {},
  peerFormProps: {
    form: {},
    setForm: () => {},
    connect: () => {}
  },
  setPeerForm: () => {},
  setPeer: () => {},
  updateSearchQuery: () => {},
  disconnectRequest: () => {},

  peerModalOpen: false,
  filteredPeers: [],
  peers: {
    peer: null,
    searchQuery: ''
  }
}

const peer = {
  address: '45.77.115.33:9735',
  bytes_recv: '63322',
  bytes_sent: '68714',
  inbound: true,
  peer_id: 3,
  ping_time: '261996',
  pub_key: '0293cb97aac77eacjc5377d761640f1b51ebba350902801e1aa62853fa7bc3a1f30',
  sat_recv: '0',
  sat_sent: '0'
}

describe('component.Peers', () => {
  describe('default components', () => {
    const props = { ...defaultProps }
    const el = shallow(<Peers {...props} />)
    it('should contain Modal and Form', () => {
      expect(el.find(PeerModal)).toHaveLength(1)
      expect(el.find(PeerForm)).toHaveLength(1)
    })
    it('should have Peers header, and plus button', () => {
      expect(el.contains('Peers')).toBe(true)
      expect(el.contains('Add new peer')).toBe(true)
    })
  })

  describe('peers are loaded', () => {
    describe('no peers', () => {
      const props = { ...defaultProps }
      const el = shallow(<Peers {...props} />)
      it('should show no peers', () => {
        expect(el.find(Peer)).toHaveLength(0)
      })
    })

    describe('peer connected', () => {
      const props = { ...defaultProps, filteredPeers: [peer] }
      const el = shallow(<Peers {...props} />)
      it('should show peer information', () => {
        expect(el.find(Peer)).toHaveLength(1)
      })
    })
  })
})
