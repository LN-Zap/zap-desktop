import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { useFormState, useFormApi } from 'informed'
import styled from 'styled-components'
import { Box } from 'rebass'
import difference from '@zap/utils/difference'
import merge from 'lodash.merge'
import { ActionBar, Button, Heading, MainContent, MenuItem, Panel, Sidebar } from 'components/UI'
import ZapLogo from 'components/Icon/ZapLogo'
import SettingsForm from 'containers/Settings/SettingsForm'
import { FieldGroupWallet, FieldGroupGeneral } from './SettingsFields'
import SettingsContext from './SettingsContext'
import messages from './messages'

const SettingsProvider = SettingsContext.Provider

const items = [
  {
    id: 'general',
    title: 'General',
  },
  {
    id: 'wallet',
    title: 'Wallet',
  },
]

const SettingsMenu = ({ items, setGroup, ...rest }) => {
  const { group } = useContext(SettingsContext)
  return (
    <Box {...rest} p={2}>
      {items.map(({ id, title }) => (
        <MenuItem key={id} isActive={id === group} onClick={() => setGroup(id)}>
          {title}
        </MenuItem>
      ))}
    </Box>
  )
}

SettingsMenu.propTypes = {
  items: PropTypes.array.isRequired,
  setGroup: PropTypes.func.isRequired,
}

const SettingsActionBar = styled(ActionBar)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`

const SettingsActionBarButtons = () => {
  const formState = useFormState()
  const formApi = useFormApi()
  return (
    <>
      <Button key="cancel" mr={6} onClick={formApi.reset} type="button" variant="secondary">
        <FormattedMessage {...messages.button_cancel} />
      </Button>

      <Button
        key="save"
        isDisabled={formState.submits > 0 && formState.invalid}
        type="submit"
        variant="normal"
      >
        <FormattedMessage {...messages.button_save} />
      </Button>
    </>
  )
}

const SettingsActions = () => {
  const { currentConfig } = useContext(SettingsContext)
  const formState = useFormState()
  const updatedConfig = merge({}, currentConfig, formState.values)
  const overrides = difference(updatedConfig, currentConfig)

  const hasChanges = Object.keys(overrides).length

  if (!hasChanges) {
    return null
  }

  return <SettingsActionBar buttons={<SettingsActionBarButtons currentConfig={currentConfig} />} />
}

const SettingsPage = ({ currentConfig }) => {
  const [group, setGroup] = useState('general')

  return (
    <SettingsProvider value={{ group, currentConfig }}>
      <>
        <Sidebar.medium pt={40}>
          <Panel>
            <Panel.Header mb={40} px={4}>
              <ZapLogo height="32px" width="70px" />
            </Panel.Header>
            <Panel.Body css={{ 'overflow-y': 'overlay' }}>
              <SettingsMenu items={items} setGroup={setGroup} />
            </Panel.Body>
          </Panel>
        </Sidebar.medium>
        <MainContent mt={6} px={5}>
          <Heading.h1 fontSize={60}>
            <FormattedMessage {...messages.settings_title} />
          </Heading.h1>

          <SettingsForm>
            <FieldGroupGeneral />
            <FieldGroupWallet />
            <SettingsActions />
          </SettingsForm>
        </MainContent>
      </>
    </SettingsProvider>
  )
}

SettingsPage.propTypes = {
  currentConfig: PropTypes.object.isRequired,
}

export default SettingsPage
