import { defineMessages } from 'react-intl'

/* eslint-disable max-len */
export default defineMessages({
  connection_title: 'How do you want to connect to the Lightning Network?',
  connection_description:
    'By default Zap will spin up a node for you and handle all the nerdy stuff in the background. However you can also setup a custom node connection and use Zap to control a remote node if you desire (for advanced users).',
  connection_details_custom_title: 'Connection details',
  connection_details_custom_description: 'Enter the connection details for your Lightning node.',
  btcpay_title: 'BTCPay Server',
  btcpay_description: 'Enter the connection details for your BTCPay Server node.',
  confirm_connection_title: 'Confirm connection',
  confirm_connection_description: 'Confirm the connection details for your Lightning node.',
  alias_title: 'What should we call you?',
  alias_description: 'Set your nickname to help others connect with you on the Lightning Network',
  autopilot_title: 'Autopilot',
  autopilot_description:
    'Autopilot is an automatic network manager. Instead of manually adding people to build your network to make payments, enable autopilot to automatically connect you to the Lightning Network using 60% of your balance.',
  create_wallet_password_title: 'Welcome!',
  create_wallet_password_description:
    'Looks like you are new here. Set a password to encrypt your wallet. This password will be needed to unlock Zap in the future',
  signup_title: "Alright, let's get set up",
  signup_description: 'Would you like to create a new wallet or import an existing one?',
  login_title: 'Welcome back!',
  login_description:
    'It looks like you already have a wallet (wallet found at: `{walletDir}`). Please enter your wallet password to unlock it.',
  import_title: 'Import your seed',
  import_description: "Recovering a wallet, nice. You don't need anyone else, you got yourself :)",
  save_seed_title: 'Save your wallet seed',
  save_seed_description:
    'Please save these 24 words securely! This will allow you to recover your wallet in the future',
  retype_seed_title: 'Retype your seed',
  retype_seed_description:
    "Your seed is important! If you lose your seed you'll have no way to recover your wallet. To make sure that you have properly saved your seed, please retype words {word1}, {word2} & {word3}"
})
