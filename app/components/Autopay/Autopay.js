import React from 'react'
import AutopayList from 'containers/Autopay/AutopayList'
import { Panel } from 'components/UI'
import AutopayHeader from './AutopayHeader'

const Autopay = props => (
  <Panel {...props}>
    <Panel.Header mx={4}>
      <AutopayHeader />
    </Panel.Header>
    <Panel.Body css={{ 'overflow-y': 'overlay', 'overflow-x': 'hidden' }}>
      <AutopayList mx={4} />
    </Panel.Body>
  </Panel>
)

export default Autopay
