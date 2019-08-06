import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Heading, MainContent, Panel, Sidebar } from 'components/UI'
import ZapLogo from 'components/Icon/ZapLogo'
import ProfilePaneConnect from 'containers/Profile/ProfilePaneConnect'
import ProfilePaneNodeInfo from 'containers/Profile/ProfilePaneNodeInfo'
import PaneSignMessage from 'containers/Profile/PaneSignMessage'
import ProfileMenu from '../ProfileMenu'
import { PANE_NODEINFO, PANE_LNDCONNECT, PANE_SIGNMESSAGE, DEFAULT_PANE } from '../constants'
import messages from './messages'

const ProfilePage = ({ activeWalletSettings }) => {
  const [group, setGroup] = useState(DEFAULT_PANE)
  const isLocalWallet = activeWalletSettings.type === 'local'

  const hasNodeInfoPane = group === PANE_NODEINFO
  const hasSignMessagePane = group === PANE_SIGNMESSAGE
  const hasConnectPane = group === PANE_LNDCONNECT && !isLocalWallet

  return (
    <>
      <Sidebar.medium pt={40}>
        <Panel>
          <Panel.Header mb={40} px={4}>
            <ZapLogo height={28} width={28} />
          </Panel.Header>
          <Panel.Body css={{ 'overflow-y': 'overlay' }}>
            <ProfileMenu group={group} isLocalWallet={isLocalWallet} p={2} setGroup={setGroup} />
          </Panel.Body>
        </Panel>
      </Sidebar.medium>

      <MainContent pb={2} pl={5} pr={6} pt={4}>
        <Heading.h1 fontSize={60} mb={2}>
          <FormattedMessage {...messages.profile_page_title} />
        </Heading.h1>
        {hasNodeInfoPane && <ProfilePaneNodeInfo />}
        {hasConnectPane && <ProfilePaneConnect />}
        {hasSignMessagePane && <PaneSignMessage />}
      </MainContent>
    </>
  )
}

ProfilePage.propTypes = {
  activeWalletSettings: PropTypes.object.isRequired,
}

export default ProfilePage
