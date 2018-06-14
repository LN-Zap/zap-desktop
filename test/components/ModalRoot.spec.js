import React from 'react'
import { shallow } from 'enzyme'
import ModalRoot from '../../app/components/ModalRoot'

const defaultProps = {
  hideModal: () => {},
  modalProps: {},
  currentTicker: {},
  currency: '',
  isTestnet: false
}

describe('no modal', () => {
  const props = { ...defaultProps }
  const el = shallow(<ModalRoot {...props} />)
  it('should return null', () => {
    expect(el.html()).toBeNull()
  })
})
