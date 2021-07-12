import React, { useState } from 'react'

import config from 'config'
import { useFormState, useFormApi } from 'informed'
import merge from 'lodash/merge'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Box, Flex } from 'rebass/styled-components'
import styled from 'styled-components'

import difference from '@zap/utils/difference'
import ZapLogo from 'components/Icon/ZapLogo'
import { ActionBar, Button, Heading, MainContent, Menu, Panel, Sidebar } from 'components/UI'
import ChangePasswordDialog from 'containers/Settings/ChangePasswordDialog'
import PasswordPromptDialog from 'containers/Settings/PasswordPromptDialog'
import PasswordSetDialog from 'containers/Settings/PasswordSetDialog'
import SettingsFieldsSecurity from 'containers/Settings/SettingsFieldsSecurity'
import SettingsForm from 'containers/Settings/SettingsForm'

import messages from './messages'
import SettingsFieldsGeneral from './SettingsFieldsGeneral'
import SettingsFieldsWallet from './SettingsFieldsWallet'

const isSecurityPaneEnabled =
  window.Zap.getPlatform() !== 'win32' || config.secureStorage.isWinPlatformSupported

const SettingsMenu = ({ group, setGroup, isLoggedIn, ...rest }) => {
  // Items accessible to unauthenticated users.
  const anonItems = [
    {
      id: 'general',
      title: <FormattedMessage {...messages.fieldgroup_general} />,
      onClick: () => setGroup('general'),
    },
  ]

  // Items only accessible to authenticated users.
  const authItems = [
    {
      id: 'wallet',
      title: <FormattedMessage {...messages.fieldgroup_wallet} />,
      onClick: () => setGroup('wallet'),
    },
  ]

  let items = [...anonItems]
  if (isLoggedIn) {
    if (isSecurityPaneEnabled) {
      authItems.push({
        id: 'security',
        title: <FormattedMessage {...messages.fieldgroup_security} />,
        onClick: () => setGroup('security'),
      })
    }
    items = items.concat(authItems)
  }

  return <Menu items={items} p={2} selectedItem={group} {...rest} />
}

SettingsMenu.propTypes = {
  group: PropTypes.string,
  isLoggedIn: PropTypes.bool,
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
        isDisabled={formState.submits > 0 && formState.invalid}
        key="save"
        type="submit"
        variant="normal"
      >
        <FormattedMessage {...messages.button_save} />
      </Button>
    </>
  )
}

const SettingsActions = ({ currentConfig }) => {
  const formState = useFormState()
  const updatedConfig = merge({}, currentConfig, formState.values)
  const overrides = difference(updatedConfig, currentConfig)

  const hasChanges = Object.keys(overrides).length

  if (!hasChanges) {
    return null
  }

  return (
    <Box mt={80}>
      <SettingsActionBar buttons={<SettingsActionBarButtons currentConfig={currentConfig} />} />
    </Box>
  )
}

SettingsActions.propTypes = {
  currentConfig: PropTypes.object.isRequired,
}

const SettingsPage = ({
  isChangePasswordDialogOpen,
  isSetPasswordDialogOpen,
  isPromptPasswordDialogOpen,
  currentConfig,
  isLoggedIn,
  ...rest
}) => {
  const [group, setGroup] = useState('general')

  const fieldgroups = {
    general: SettingsFieldsGeneral,
    wallet: SettingsFieldsWallet,
    security: isSecurityPaneEnabled && SettingsFieldsSecurity,
  }

  const FieldGroup = fieldgroups[group]
  if (!FieldGroup) {
    return null
  }

  return (
    <>
      <Flex width={1} {...rest}>
        <Sidebar.Medium pt={40}>
          <Panel>
            <Panel.Header mb={40} px={4}>
              <ZapLogo height={28} width={28} />
            </Panel.Header>
            <Panel.Body sx={{ overflowY: 'overlay' }}>
              <SettingsMenu group={group} isLoggedIn={isLoggedIn} setGroup={setGroup} />
            </Panel.Body>
          </Panel>
        </Sidebar.Medium>
        <MainContent pb={2} pl={5} pr={6} pt={4}>
          <Heading.H1 fontSize={60}>
            <FormattedMessage {...messages.settings_title} />
          </Heading.H1>

          <SettingsForm>
            <FieldGroup currentConfig={currentConfig} />
            <SettingsActions currentConfig={currentConfig} />
          </SettingsForm>
        </MainContent>
      </Flex>
      {isChangePasswordDialogOpen && <ChangePasswordDialog />}
      {isPromptPasswordDialogOpen && <PasswordPromptDialog />}
      {isSetPasswordDialogOpen && <PasswordSetDialog />}
    </>
  )
}

SettingsPage.propTypes = {
  currentConfig: PropTypes.object.isRequired,
  isChangePasswordDialogOpen: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  isPromptPasswordDialogOpen: PropTypes.bool,
  isSetPasswordDialogOpen: PropTypes.bool,
}

export default SettingsPage
