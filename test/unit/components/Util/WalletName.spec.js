import React from 'react'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
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
      const tree = renderWithTheme(<WalletName wallet={wallet} />).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
  describe('local wallet, without name', () => {
    it('should render correctly', () => {
      const wallet = {
        type: 'local',
        id: 1,
        host: 'local.host',
      }
      const tree = renderWithTheme(<WalletName wallet={wallet} />).toJSON()
      expect(tree).toMatchSnapshot()
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
      const tree = renderWithTheme(<WalletName wallet={wallet} />).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
  describe('custom wallet, without name', () => {
    it('should render correctly', () => {
      const wallet = {
        type: 'custom',
        id: 1,
        host: 'local.host',
      }
      const tree = renderWithTheme(<WalletName wallet={wallet} />).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
