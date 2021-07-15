import React from 'react'

import { FormattedMessage } from 'react-intl'
import { ThemeProvider } from 'styled-components'

import { Panel, Heading } from 'components/UI'
import AutopayCreateModal from 'containers/Autopay/AutopayCreateModal'
import AutopayList from 'containers/Autopay/AutopayList'
import AutopayMerchantList from 'containers/Autopay/AutopayMerchantList'
import { autopay } from 'themes'

import AutopayActions from './AutopayActions'
import AutopayHeader from './AutopayHeader'
import messages from './messages'

const Autopay = props => (
  <ThemeProvider theme={autopay}>
    <>
      <Panel {...props}>
        <Panel.Header mx={4}>
          <AutopayHeader />
        </Panel.Header>
        <Panel.Body sx={{ overflowY: 'overlay', overflowX: 'hidden' }}>
          <AutopayList />
          <Heading.H1 mt={4} mx={4}>
            <FormattedMessage {...messages.merchant_list_title} />
          </Heading.H1>
          <AutopayActions mx={4} my={3} />
          <AutopayMerchantList mx={4} />
        </Panel.Body>
      </Panel>
      <AutopayCreateModal />
    </>
  </ThemeProvider>
)

export default Autopay
