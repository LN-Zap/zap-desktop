import React from 'react'
import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'
import { WalletName } from 'components/Util'

describe('component.WalletName', () => {
  describe('local wallet, with name', () => {
    it('should render correctly', () => {
      const wallet = {
        type: 'local',
        id: 1,
        host: 'local.host',
        name: 'Wallet name',
      }
      const wrapper = shallow(<WalletName wallet={wallet} />)
      expect(toJSON(wrapper)).toMatchSnapshot()
    })
  })
  describe('local wallet, without name', () => {
    it('should render correctly', () => {
      const wallet = {
        type: 'local',
        id: 1,
        host: 'local.host',
      }
      const wrapper = shallow(<WalletName wallet={wallet} />)
      expect(toJSON(wrapper)).toMatchSnapshot()
    })
  })

  describe('custom wallet, with name', () => {
    it('should render correctly', () => {
      const wallet = {
        type: 'custom',
        id: 1,
        host: 'local.host',
        name: 'Wallet name',
      }
      const wrapper = shallow(<WalletName wallet={wallet} />)
      expect(toJSON(wrapper)).toMatchSnapshot()
    })
  })
  describe('custom wallet, without name', () => {
    it('should render correctly', () => {
      const wallet = {
        type: 'custom',
        id: 1,
        host: 'local.host',
      }
      const wrapper = shallow(<WalletName wallet={wallet} />)
      expect(toJSON(wrapper)).toMatchSnapshot()
    })
  })
})
