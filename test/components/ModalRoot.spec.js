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

describe('SuccessfulSendCoins modal', () => {
  const props = {
    ...defaultProps,
    modalType: 'SUCCESSFUL_SEND_COINS',
    modalProps: {
      amount: 10000000,
      addr: 'mkrfWvHSbUjgyne4EWnydWekywWBjrucKs',
      txid: 'fd7dfc8b809a128323b1b679fe31e27ed7b34baae0a79cd4a290fb4dab892d26'
    }
  }
  const el = shallow(<ModalRoot {...props} />)
  it('should render specific modal', () => {
    expect(el.find(SuccessfulSendCoins).length).toBe(1)
  })
})

describe('SuccessfulSendPayment modal', () => {
  const props = {
    ...defaultProps,
    modalType: 'SUCCESSFUL_SEND_PAYMENT',
    modalProps: {}
  }
  const el = shallow(<ModalRoot {...props} />)
  it('should render specific modal', () => {
    expect(el.find(SuccessfulSendPayment).length).toBe(1)
  })
})
