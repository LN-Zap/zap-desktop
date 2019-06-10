import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { useFormState, useFormApi } from 'informed'
import styled from 'styled-components'
import { Flex } from 'rebass'
import merge from 'lodash/merge'
import difference from '@zap/utils/difference'
import { ActionBar, Button, Heading, MainContent, Menu, Panel, Sidebar } from 'components/UI'
import ZapLogo from 'components/Icon/ZapLogo'
import SettingsForm from 'containers/Settings/SettingsForm'
import SettingsFieldsWallet from './SettingsFieldsWallet'
import SettingsFieldsGeneral from './SettingsFieldsGeneral'
import messages from './messages'

const SettingsMenu = ({ group, setGroup, ...rest }) => {
  const items = [
    {
      id: 'general',
      title: <FormattedMessage {...messages.fieldgroup_general} />,
      onClick: () => setGroup('general'),
    },
    {
      id: 'wallet',
      title: <FormattedMessage {...messages.fieldgroup_wallet} />,
      onClick: () => setGroup('wallet'),
    },
  ]

  return <Menu items={items} p={2} selectedItem={group} {...rest} />
}

SettingsMenu.propTypes = {
  group: PropTypes.string,
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

const SettingsActions = ({ currentConfig }) => {
  const formState = useFormState()
  const updatedConfig = merge({}, currentConfig, formState.values)
  const overrides = difference(updatedConfig, currentConfig)

  const hasChanges = Object.keys(overrides).length

  if (!hasChanges) {
    return null
  }

  return <SettingsActionBar buttons={<SettingsActionBarButtons currentConfig={currentConfig} />} />
}

SettingsActions.propTypes = {
  currentConfig: PropTypes.object.isRequired,
}

const SettingsPage = ({ currentConfig, ...rest }) => {
  const [group, setGroup] = useState('general')

  return (
    <Flex width={1} {...rest}>
      <Sidebar.medium pt={40}>
        <Panel>
          <Panel.Header mb={40} px={4}>
            <ZapLogo height={28} width={28} />
          </Panel.Header>
          <Panel.Body
            css={`
              overflow-y: overlay;
            `}
          >
            <SettingsMenu group={group} setGroup={setGroup} />
          </Panel.Body>
        </Panel>
      </Sidebar.medium>
      <MainContent px={5} py={4}>
        <Heading.h1 fontSize={60}>
          <FormattedMessage {...messages.settings_title} />
        </Heading.h1>

        <SettingsForm>
          {group === 'general' && <SettingsFieldsGeneral currentConfig={currentConfig} />}
          {group === 'wallet' && <SettingsFieldsWallet currentConfig={currentConfig} />}
          <SettingsActions currentConfig={currentConfig} />
        </SettingsForm>
      </MainContent>
    </Flex>
  )
}

SettingsPage.propTypes = {
  currentConfig: PropTypes.object.isRequired,
}

export default SettingsPage
