import React, { useState } from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import ZapLogo from 'components/Icon/ZapLogo'
import { Heading, MainContent, Panel, Sidebar } from 'components/UI'
import ProfilePaneConnect from 'containers/Profile/ProfilePaneConnect'
import ProfilePaneNodeInfo from 'containers/Profile/ProfilePaneNodeInfo'
import ProfilePaneSignMessage from 'containers/Profile/ProfilePaneSignMessage'
import ProfilePaneVerifyMessage from 'containers/Profile/ProfilePaneVerifyMessage'

import {
  PANE_NODEINFO,
  PANE_LNDCONNECT,
  PANE_SIGNMESSAGE,
  PANE_VERIFYMESSAGE,
  DEFAULT_PANE,
} from '../constants'
import ProfileMenu from '../ProfileMenu'
import messages from './messages'

const ProfilePage = ({ activeWalletSettings }) => {
  const [group, setGroup] = useState(DEFAULT_PANE)
  const isLocalWallet = activeWalletSettings.type === 'local'

  const hasNodeInfoPane = group === PANE_NODEINFO
  const hasSignMessagePane = group === PANE_SIGNMESSAGE && !isLocalWallet
  const hasVerifyMessagePane = group === PANE_VERIFYMESSAGE
  const hasConnectPane = group === PANE_LNDCONNECT && !isLocalWallet

  return (
    <>
      <Sidebar.Medium pt={40}>
        <Panel>
          <Panel.Header mb={40} px={4}>
            <ZapLogo height={28} width={28} />
          </Panel.Header>
          <Panel.Body sx={{ overflowY: 'overlay' }}>
            <ProfileMenu group={group} isLocalWallet={isLocalWallet} p={2} setGroup={setGroup} />
          </Panel.Body>
        </Panel>
      </Sidebar.Medium>

      <MainContent pb={2} pl={5} pr={6} pt={4}>
        <Heading.H1 fontSize={60} mb={2}>
          <FormattedMessage {...messages.profile_page_title} />
        </Heading.H1>
        {hasNodeInfoPane && <ProfilePaneNodeInfo />}
        {hasConnectPane && <ProfilePaneConnect />}
        {hasSignMessagePane && <ProfilePaneSignMessage />}
        {hasVerifyMessagePane && <ProfilePaneVerifyMessage />}
      </MainContent>
    </>
  )
}

ProfilePage.propTypes = {
  activeWalletSettings: PropTypes.object.isRequired,
}

export default ProfilePage
