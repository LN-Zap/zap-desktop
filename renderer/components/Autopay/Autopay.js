import React from 'react'
import { ThemeProvider } from 'styled-components'
import { Panel } from 'components/UI'
import AutopayList from 'containers/Autopay/AutopayList'
import AutopayCreateModal from 'containers/Autopay/AutopayCreateModal'
import { palette } from 'themes/base'
import createThemeVariant from 'themes/util'
import AutopayHeader from './AutopayHeader'

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
        </Panel.Body>
      </Panel>
      <AutopayCreateModal />
    </>
  </ThemeProvider>
)

export default Autopay
