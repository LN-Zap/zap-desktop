import { defineMessages } from 'react-intl'

/* eslint-disable max-len */
export default defineMessages({
  alias_description: 'Set your nickname to help others connect with you on the Lightning Network',
  alias_title: 'What should we call you?',
  autopilot_description:
    'Autopilot is an automatic network manager. Instead of manually adding people to build your network to make payments, enable autopilot to automatically connect you to the Lightning Network using 60% of your balance.',
  autopilot_title: 'Autopilot',
  back: 'back',
  btcpay_page_title: 'BTCPay Server',
  btcpay_page_description: 'Enter the connection details for your BTCPay Server node.',
  btcpay_connection_string_description:
    "Paste the full content of your BTCPay Server connection config file. This can be found by clicking the link entitled 'Click here to open the configuration file' in your BTCPay Server gRPC settings.",
  btcpay_connection_type_description:
    'Connect to your own BTCPay Server instance to access your BTCPay Server wallet.',
  btcpay_description: 'Enter the connection details for your BTCPay Server node.',
  btcpay_error: 'Invalid connection string.',
  btcpay_title: 'Connect to BTCPay Server',
  cert_description: 'Path to the lnd tls cert. Example: /path/to/tls.cert',
  cert_title: 'TLS Certificate',
  confirm_connection_description: 'Confirm the connection details for your Lightning node.',
  confirm_connection_title: 'Confirm connection',
  connection_description: 'Let Zap spin up and manage a node for you, or connect to your own node.',
  connection_details_custom_description: 'Enter the connection details for your Lightning node.',
  connection_details_custom_title: 'Connection details',
  connection_string_label: 'Connection String',
  connection_string_placeholder: 'BTCPay Server Connection String',
  connection_title: 'How do you want to connect to the Lightning Network?',
  create_wallet_password_description:
    'Looks like you are new here. Set a password to encrypt your wallet. This password will be needed to unlock Zap in the future',
  create_wallet_password_title: 'Welcome!',
  custom: 'Custom',
  custom_description:
    'Connect to your own node. You will need to provide your own connection settings so this is for advanced users only.',
  default: 'Default',
  default_description:
    'By selecting the defualt mode we will do everything for you. Just click and go!',
  disable: 'Disable Autopilot',
  enable: 'Enable Autopilot',
  help: 'Need Help?',
  hostname_description: 'Hostname and port of the Lnd gRPC interface. Example: localhost:10009',
  hostname_title: 'Host',
  import_description: "Recovering a wallet, nice. You don't need anyone else, you got yourself :)",
  import_title: 'Import your seed',
  login_description: 'Please enter your wallet password to unlock it.',
  login_title: 'Welcome back!',
  macaroon_description: 'Path to the lnd macaroon file. Example: /path/to/admin.macaroon',
  next: 'Next',
  nickname: 'Nickname',
  only: 'only',
  password_confirm_placeholder: 'Confirm Password',
  password_error_length: 'Password must be at least {passwordMinLength} characters long',
  password_error_match: 'Passwords do not match',
  password_label: 'Password',
  password_placeholder: 'Enter your password',
  password_description:
    'You would have set your password when first creating your walet. This is separate from your 24 word seed.',
  retype_seed_description:
    "Your seed is important! If you lose your seed you'll have no way to recover your wallet. To make sure that you have properly saved your seed, please retype words {word1}, {word2} & {word3}",
  retype_seed_title: 'Retype your seed',
  save_seed_description:
    'Please save these 24 words securely! This will allow you to recover your wallet in the future',
  save_seed_title: 'Save your wallet seed',
  signup_create: 'Create new wallet',
  signup_description: 'Would you like to create a new wallet or import an existing one?',
  signup_import: 'Import existing wallet',
  signup_title: "Alright, let's get set up",
  unlock: 'Unlock',
  unlocking: 'Unlocking',
  verify_host_description: 'Please check the hostname carefully.',
  verify_host_title: 'Are you sure you want to connect to',
  word_placeholder: 'word'
})
