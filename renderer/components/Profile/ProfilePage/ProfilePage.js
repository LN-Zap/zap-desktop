import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex } from 'rebass'
import { HeaderBar, MainContent, Panel, Sidebar } from 'components/UI'
import ZapLogo from 'components/Icon/ZapLogo'
import ProfilePaneConnect from 'containers/Profile/ProfilePaneConnect'
import ProfilePaneNodeInfo from 'containers/Profile/ProfilePaneNodeInfo'
import ProfileMenu from '../ProfileMenu'
import { PANE_NODEINFO, PANE_LNDCONNECT, DEFAULT_PANE } from '../constants'
import messages from './messages'

const ProfilePage = ({ activeWalletSettings, ...rest }) => {
  const [group, setGroup] = useState(DEFAULT_PANE)
  const isLocalWallet = activeWalletSettings.type === 'local'

  const hasNodeInfoPane = group === PANE_NODEINFO
  const hasConnectPane = group === PANE_LNDCONNECT && !isLocalWallet

  return (
    <Flex width={1} {...rest}>
      <Sidebar.medium pt={40}>
        <Panel>
          <Panel.Header mb={30} px={4}>
            <ZapLogo height={28} width={28} />
          </Panel.Header>
          <Panel.Body
            css={`
              overflow-y: overlay;
            `}
          >
            <ProfileMenu group={group} isLocalWallet={isLocalWallet} p={2} setGroup={setGroup} />
          </Panel.Body>
        </Panel>
      </Sidebar.medium>
      <MainContent>
        <Panel>
          <Panel.Header>
            <HeaderBar>
              <FormattedMessage {...messages.profile_page_title} />
            </HeaderBar>
          </Panel.Header>
          <Panel.Body css={{ 'overflow-y': 'overlay' }} mt={5} pb={2} px={5}>
            {hasNodeInfoPane && <ProfilePaneNodeInfo />}
            {hasConnectPane && <ProfilePaneConnect />}
          </Panel.Body>
        </Panel>
      </MainContent>
    </Flex>
  )
}

ProfilePage.propTypes = {
  activeWalletSettings: PropTypes.object.isRequired,
}

export default ProfilePage
