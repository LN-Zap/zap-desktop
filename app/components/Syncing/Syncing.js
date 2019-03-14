import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import copy from 'copy-to-clipboard'
import { Box, Flex } from 'rebass'
import { Bar, Button, Heading, Header, Panel, QRCode, Text, Link } from 'components/UI'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import messages from './messages'

class Syncing extends Component {
  static propTypes = {
    address: PropTypes.string.isRequired,
    blockHeight: PropTypes.number,
    hasSynced: PropTypes.bool,
    intl: intlShape.isRequired,
    isLightningGrpcActive: PropTypes.bool,
    lndBlockHeight: PropTypes.number,
    lndCfilterHeight: PropTypes.number,
    network: PropTypes.string,
    setIsWalletOpen: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
    syncPercentage: PropTypes.number,
    syncStatus: PropTypes.string.isRequired,
  }

  state = {
    timer: null,
    syncMessageDetail: null,
    syncMessageExtraDetail: null,
  }

  componentDidMount() {
    const { setIsWalletOpen, syncStatus } = this.props
    setIsWalletOpen(true)
    if (syncStatus === 'waiting') {
      this.setWaitingTimer()
    }
  }

  componentDidUpdate(prevProps) {
    const { syncStatus } = this.props
    if (syncStatus === 'waiting' && prevProps.syncStatus !== 'waiting') {
      this.setWaitingTimer()
    }
    if (syncStatus !== 'waiting' && prevProps.syncStatus === 'waiting') {
      this.clearWaitingTimer()
    }
  }

  componentWillUnmount() {
    const { timer } = this.state
    clearInterval(timer)
  }

  setWaitingTimer = () => {
    const { syncStatus, intl } = this.props

    // If we are still waiting for peers after some time, advise te user it could take a wile.
    let timer = setTimeout(() => {
      if (syncStatus === 'waiting') {
        this.setState({
          syncMessageDetail: intl.formatMessage({ ...messages.taking_time }),
          syncMessageExtraDetail: intl.formatMessage({ ...messages.grab_coffee }),
        })
      }
    }, 5000)

    this.setState({ timer })
  }

  clearWaitingTimer = () => {
    const { timer } = this.state
    clearInterval(timer)
    this.setState({
      syncMessageDetail: null,
      syncMessageExtraDetail: null,
    })
  }

  render() {
    const {
      hasSynced,
      syncStatus,
      syncPercentage,
      address,
      blockHeight,
      lndBlockHeight,
      lndCfilterHeight,
      isLightningGrpcActive,
      intl,
      network,
      showNotification,
    } = this.props
    let { syncMessageDetail, syncMessageExtraDetail } = this.state

    const copyToClipboard = data => {
      copy(data)
      const notifBody = intl.formatMessage({ ...messages.address_copied_notification_description })
      showNotification(notifBody)
    }

    if (isLightningGrpcActive && syncStatus === 'complete') {
      return <Redirect to="/app" />
    }

    let syncMessage
    if (syncStatus === 'waiting') {
      syncMessage = intl.formatMessage({ ...messages.waiting_for_peers })
    } else if (syncStatus === 'in-progress') {
      if (typeof syncPercentage === 'undefined') {
        syncMessage = intl.formatMessage({ ...messages.preparing })
        syncMessageDetail = null
        syncMessageExtraDetail = null
      } else {
        syncMessage = `${syncPercentage}%`
        syncMessageDetail = intl.formatMessage(
          { ...messages.block_progress },
          {
            currentBlock: lndBlockHeight.toLocaleString(),
            totalBlocks: blockHeight.toLocaleString(),
          }
        )
        syncMessageExtraDetail = intl.formatMessage(
          { ...messages.filter_progress },
          {
            currentFilter: lndCfilterHeight.toLocaleString(),
            totalFilters: blockHeight.toLocaleString(),
          }
        )
      }
    }

    return (
      <Panel width={1}>
        <Panel.Header mx="auto" width={9 / 16}>
          {hasSynced ? (
            <Header
              subtitle={<FormattedMessage {...messages.sync_description} />}
              title={<FormattedMessage {...messages.sync_title} />}
            />
          ) : (
            <Header
              subtitle={
                network === 'testnet' && (
                  <Link onClick={() => window.Zap.openTestnetFaucet()}>
                    <FormattedMessage {...messages.fund_link} />
                  </Link>
                )
              }
              title={<FormattedMessage {...messages.fund_title} />}
            />
          )}
          <Bar my={3} />
        </Panel.Header>

        <Panel.Body mb={3} mx="auto" width={9 / 16}>
          {!hasSynced && address && address.length && (
            <Flex
              alignItems="center"
              css={{ height: '100%' }}
              flexDirection="column"
              justifyContent="center"
            >
              <QRCode mx="auto" size="small" value={address} />
              <Text my={3}>{address}</Text>
              <Button mx="auto" onClick={() => copyToClipboard(address)} size="small">
                <FormattedMessage {...messages.copy_address} />
              </Button>
            </Flex>
          )}
          {hasSynced && (
            <Flex
              alignItems="center"
              css={{ height: '100%' }}
              flexDirection="column"
              justifyContent="center"
            >
              <Text my={3}>
                <FormattedMessage {...messages.tutorials_list_description} />
              </Text>
              <Button mx="auto" onClick={() => window.Zap.openHelpPage()} size="small">
                <FormattedMessage {...messages.tutorials_button_text} />
              </Button>
            </Flex>
          )}
        </Panel.Body>

        <Panel.Footer bg="secondaryColor" css={{ 'min-height': '160px' }} p={3}>
          <Flex
            alignItems="center"
            flexDirection="column"
            justifyContent="center"
            mx="auto"
            width={9 / 16}
          >
            <Text fontWeight="normal" mb={3}>
              <FormattedMessage {...messages.sync_caption} />
            </Text>
            <Heading.h1 mb={2}>{syncMessage}</Heading.h1>
            <Box bg="grey" css={{ height: '4px' }} mb={2} width={1}>
              <Box
                bg="lightningOrange"
                css={{ height: '100%' }}
                width={syncPercentage ? `${syncPercentage}%` : 0}
              />
            </Box>

            <Text>{syncMessageDetail}</Text>
            <Text>{syncMessageExtraDetail}</Text>
          </Flex>
        </Panel.Footer>
      </Panel>
    )
  }
}

export default injectIntl(Syncing)
