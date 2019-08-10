import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Menu } from 'components/UI'
import { PANE_NODEINFO, PANE_LNDCONNECT, PANE_SIGNMESSAGE } from '../constants'
import messages from './messages'

const ProfileMenu = ({ group, setGroup, isLocalWallet, ...rest }) => {
  // Define all possible menu links.
  const nodeInfoLink = {
    id: PANE_NODEINFO,
    title: <FormattedMessage {...messages.profile_pane_nodeinfo_title} />,
    onClick: () => setGroup(PANE_NODEINFO),
  }
  const connectLink = {
    id: PANE_LNDCONNECT,
    title: <FormattedMessage {...messages.profile_pane_connect_title} />,
    onClick: () => setGroup(PANE_LNDCONNECT),
  }

  const signMessageLink = {
    id: PANE_SIGNMESSAGE,
    title: <FormattedMessage {...messages.sign_message_pane_connect_title} />,
    onClick: () => setGroup(PANE_SIGNMESSAGE),
  }

  // Get set of menu links based on wallet type.
  const getLocalLinks = () => [nodeInfoLink, signMessageLink]
  const getRemoteLinks = () => [nodeInfoLink, connectLink, signMessageLink]
  const items = isLocalWallet ? getLocalLinks() : getRemoteLinks()

  return <Menu items={items} selectedItem={group} {...rest} />
}

ProfileMenu.propTypes = {
  group: PropTypes.string,
  isLocalWallet: PropTypes.bool,
  setGroup: PropTypes.func.isRequired,
}

export default ProfileMenu
