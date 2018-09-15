import { defineMessages } from 'react-intl'

/* eslint-disable max-len */
export default defineMessages({
  title: 'Add Funds to Network',
  description:
    "Opening a channel will help you send and receive money on the Lightning Network. You aren't spending any money, rather moving the money you plan to use onto the network.",
  submit: 'Submit',
  duplicate_warnig:
    'You currently have {activeChannels, plural, zero {no active channels} one {1 active channel} other {{activeChannels} active channels}} open to {aliasMsg, select, this_node {this node} other {{aliasMsg}}} with a capacity of'
})
