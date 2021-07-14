import React from 'react'

import { shallow } from 'enzyme'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import Error from 'components/Icon/Error'
import Success from 'components/Icon/Success'
import Warning from 'components/Icon/Warning'
import { Notification, Spinner } from 'components/UI'

describe('component.UI.Notification', () => {
  it('should render correctly', () => {
    const tree = renderWithTheme(<Notification />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  describe('variant = success', () => {
    it('should render with the success icon', () => {
      const wrapper = shallow(<Notification variant="success" />)
      expect(wrapper.find(Success)).toHaveLength(1)
    })
  })

  describe('variant = warning', () => {
    it('should render with the warning icon', () => {
      const wrapper = shallow(<Notification variant="warning" />)
      expect(wrapper.find(Warning)).toHaveLength(1)
    })
  })

  describe('variant = error', () => {
    it('should render with the error icon', () => {
      const wrapper = shallow(<Notification variant="error" />)
      expect(wrapper.find(Error)).toHaveLength(1)
    })
  })

  describe('processing', () => {
    it('should render with the spinner', () => {
      const wrapper = shallow(<Notification isProcessing />)
      expect(wrapper.find(Spinner)).toHaveLength(1)
    })
  })
})
