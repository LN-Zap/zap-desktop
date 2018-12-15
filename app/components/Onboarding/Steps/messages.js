import { defineMessages } from 'react-intl'

/* eslint-disable max-len */
export default defineMessages({
  alias_description: 'Set your node alias to help others connect with you on the Lightning Network',
  alias_title: 'What should we call you?',
  alias_label: 'Alias',
  autopilot_description:
    'Autopilot is an automatic network manager. Instead of manually adding people to build your network to make payments, enable autopilot to automatically connect you to the Lightning Network using 60% of your balance.',
  autopilot_title: 'Autopilot',
  back: 'back',
  btcpay_page_title: 'BTCPay Server',
  btcpay_page_description: 'Enter the connection details for your BTCPay Server node.',
  btcpay_connection_string_description:
    "Paste the full content of your BTCPay Server connection config file. This can be found by clicking the link entitled 'Click here to open the configuration file' in your BTCPay Server gRPC settings.",
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
  seed_warning:
    'Keep this private! If someone gains access to this list they can steal your money.',
  signup_create: 'Create new wallet',
  connection_type_create_label: 'Create new wallet',
  connection_type_create_description:
    'Let Zap create a new bitcoin wallet and lightning node for you.',
  connection_type_import_label: 'Import existing wallet',
  connection_type_import_description: 'Import your own seed to recover an existing wallet.',
  connection_type_custom_label: 'Connect your own node',
  connection_type_custom_description:
    'Enter the connection details for your own Lightning node to access access it with Zap.',
  connection_type_btcpayserver_label: 'BTCPay Server',
  connection_type_btcpayserver_description:
    'Connect to your own BTCPay Server instance to access your BTCPay Server wallet.',
  signup_description: 'Would you like to create a new wallet or import an existing one?',
  signup_import: 'Import existing wallet',
  signup_title: "Alright, let's get set up",
  unlock: 'Unlock',
  unlocking: 'Unlocking',
  verify_host_description: 'Please check the hostname carefully.',
  verify_host_title: 'Are you sure you want to connect to',
  wallet_name_description:
    'Set a name for your wallet to help you identify it in Zap. This is for internal purposes only and will not be broadcast on the Lightning Network.',
  wallet_name_title: 'What do you want to call this wallet?',
  wallet_name_label: 'Wallet Name',
  word_placeholder: 'word',
  generating_seed: 'Generating Seed...'
})
