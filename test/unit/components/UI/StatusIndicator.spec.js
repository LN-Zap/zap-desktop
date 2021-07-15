import React from 'react'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { StatusIndicator } from 'components/UI'

describe('component.UI.StatusIndicator', () => {
  describe('online', () => {
    it('should render correctly', () => {
      const tree = renderWithTheme(<StatusIndicator variant="online" />).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
  describe('offline', () => {
    it('should render correctly', () => {
      const tree = renderWithTheme(<StatusIndicator variant="offline" />).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
  describe('pending', () => {
    it('should render correctly', () => {
      const tree = renderWithTheme(<StatusIndicator variant="pending" />).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
  describe('closing', () => {
    it('should render correctly', () => {
      const tree = renderWithTheme(<StatusIndicator variant="closing" />).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
