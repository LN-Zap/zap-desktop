import React from 'react'
import { ThemeProvider } from 'styled-components'
import { Panel, Heading } from 'components/UI'
import { FormattedMessage } from 'react-intl'
import AutopayList from 'containers/Autopay/AutopayList'
import AutopayMerchantList from 'containers/Autopay/AutopayMerchantList'
import AutopayCreateModal from 'containers/Autopay/AutopayCreateModal'
import { palette } from 'themes/base'
import createThemeVariant from 'themes/util'
import AutopayHeader from './AutopayHeader'
import AutopayActions from './AutopayActions'
import messages from './messages'

const customiseTheme = theme => {
  return createThemeVariant('autopilot', {
    ...theme.colors,
    lightningOrange: palette.superBlue,
  })
}

const Autopay = props => (
  <ThemeProvider theme={customiseTheme}>
    <>
      <Panel {...props}>
        <Panel.Header mx={4}>
          <AutopayHeader />
        </Panel.Header>
        <Panel.Body css={{ 'overflow-y': 'overlay', 'overflow-x': 'hidden' }}>
          <AutopayList mx={4} />
          <Heading.h1 mt={4} mx={4}>
            <FormattedMessage {...messages.merchant_list_title} />
          </Heading.h1>
          <AutopayActions mx={4} my={3} />
          <AutopayMerchantList mx={4} />
        </Panel.Body>
      </Panel>
      <AutopayCreateModal />
    </>
  </ThemeProvider>
)

export default Autopay
