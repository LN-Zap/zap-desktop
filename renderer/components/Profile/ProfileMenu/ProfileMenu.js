import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { Menu } from 'components/UI'

import { PANE_NODEINFO, PANE_LNDCONNECT, PANE_SIGNMESSAGE, PANE_VERIFYMESSAGE } from '../constants'
import messages from './messages'

const ProfileMenu = ({ group, setGroup, isLocalWallet, ...rest }) => {
  const menuLink = (id, message) => ({
    id,
    title: <FormattedMessage {...message} />,
    onClick: () => setGroup(id),
  })

  // Define all possible menu links.
  const nodeInfoLink = menuLink(PANE_NODEINFO, messages.profile_pane_nodeinfo_title)
  const connectLink = menuLink(PANE_LNDCONNECT, messages.profile_pane_connect_title)
  const signMessageLink = menuLink(PANE_SIGNMESSAGE, messages.sign_message_title)
  const verifyMessageLink = menuLink(PANE_VERIFYMESSAGE, messages.verify_message_title)

  // Get set of menu links based on wallet type.
  const getLocalLinks = () => [nodeInfoLink, verifyMessageLink]
  const getRemoteLinks = () => [nodeInfoLink, connectLink, signMessageLink, verifyMessageLink]
  const items = isLocalWallet ? getLocalLinks() : getRemoteLinks()

  return <Menu items={items} selectedItem={group} {...rest} />
}

ProfileMenu.propTypes = {
  group: PropTypes.string,
  isLocalWallet: PropTypes.bool,
  setGroup: PropTypes.func.isRequired,
}

export default ProfileMenu
