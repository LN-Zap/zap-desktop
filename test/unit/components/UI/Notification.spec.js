import React from 'react'
import renderer from 'react-test-renderer'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import SystemSuccess from 'components/Icon/SystemSuccess'
import SystemWarning from 'components/Icon/SystemWarning'
import SystemError from 'components/Icon/SystemError'
import { Notification, Spinner } from 'components/UI'

configure({ adapter: new Adapter() })

describe('component.UI.Notification', () => {
  it('should render correctly', () => {
    const tree = renderer.create(<Notification />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  describe('variant = success', () => {
    it('should render with the success icon', () => {
      const wrapper = shallow(<Notification variant="success" />)
      expect(wrapper.find(SystemSuccess)).toHaveLength(1)
    })
  })

  describe('variant = warning', () => {
    it('should render with the warning icon', () => {
      const wrapper = shallow(<Notification variant="warning" />)
      expect(wrapper.find(SystemWarning)).toHaveLength(1)
    })
  })

  describe('variant = error', () => {
    it('should render with the error icon', () => {
      const wrapper = shallow(<Notification variant="error" />)
      expect(wrapper.find(SystemError)).toHaveLength(1)
    })
  })

  describe('processing', () => {
    it('should render with the spinner', () => {
      const wrapper = shallow(<Notification processing />)
      expect(wrapper.find(Spinner)).toHaveLength(1)
    })
  })
})
