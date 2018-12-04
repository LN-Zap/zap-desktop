import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import copy from 'copy-to-clipboard'
import { Box, Flex } from 'rebass'
import { Bar, Button, Heading, Header, Panel, QRCode, Text } from 'components/UI'
import { showNotification } from 'lib/utils/notifications'
import { FormattedMessage, injectIntl } from 'react-intl'
import messages from './messages'

class Syncing extends Component {
  static propTypes = {
    address: PropTypes.string.isRequired,
    hasSynced: PropTypes.bool,
    syncStatus: PropTypes.string.isRequired,
    syncPercentage: PropTypes.number,
    blockHeight: PropTypes.number,
    setIsWalletOpen: PropTypes.func.isRequired,
    lndBlockHeight: PropTypes.number,
    lndCfilterHeight: PropTypes.number,
    lightningGrpcActive: PropTypes.bool
  }

  state = {
    timer: null,
    syncMessageDetail: null,
    syncMessageExtraDetail: null
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
          syncMessageExtraDetail: intl.formatMessage({ ...messages.grab_coffee })
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
      syncMessageExtraDetail: null
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
      lightningGrpcActive,
      intl
    } = this.props
    let { syncMessageDetail, syncMessageExtraDetail } = this.state

    if (lightningGrpcActive && syncStatus === 'complete') {
      return <Redirect to="/app" />
    }

    const copyClicked = () => {
      copy(address)
      showNotification('Noice', 'Successfully copied to clipboard')
    }
    let syncMessage
    if (syncStatus === 'waiting') {
      syncMessage = intl.formatMessage({ ...messages.waiting_for_peers })
    } else if (syncStatus === 'in-progress') {
      if (typeof syncPercentage === 'undefined' || Number(syncPercentage) <= 0) {
        syncMessage = intl.formatMessage({ ...messages.preparing })
        syncMessageDetail = null
        syncMessageExtraDetail = null
      } else if (syncPercentage) {
        syncMessage = `${syncPercentage}%`
        syncMessageDetail = intl.formatMessage(
          { ...messages.block_progress },
          {
            currentBlock: lndBlockHeight.toLocaleString(),
            totalBlocks: blockHeight.toLocaleString()
          }
        )
        syncMessageExtraDetail = intl.formatMessage(
          { ...messages.filter_progress },
          {
            currentFilter: lndCfilterHeight.toLocaleString(),
            totalFilters: blockHeight.toLocaleString()
          }
        )
      }
    }

    return (
      <Panel width={1}>
        <Panel.Header width={9 / 16} mx="auto">
          {hasSynced ? (
            <Header
              title={<FormattedMessage {...messages.sync_title} />}
              subtitle={<FormattedMessage {...messages.sync_description} />}
            />
          ) : (
            <Header
              title={<FormattedMessage {...messages.fund_title} />}
              subtitle={<FormattedMessage {...messages.fund_description} />}
            />
          )}
          <Bar my={3} />
        </Panel.Header>

        <Panel.Body width={9 / 16} mx="auto" mb={3}>
          {hasSynced === false &&
            address &&
            address.length && (
              <Flex
                alignItems="center"
                flexDirection="column"
                justifyContent="center"
                css={{ height: '100%' }}
              >
                <QRCode value={address} mx="auto" />
                <Text my={3}>{address}</Text>
                <Button size="small" onClick={copyClicked} mx="auto">
                  <FormattedMessage {...messages.copy_address} />
                </Button>
              </Flex>
            )}
          {hasSynced && (
            <Flex
              alignItems="center"
              flexDirection="column"
              justifyContent="center"
              css={{ height: '100%' }}
            >
              <Text my={3}>
                <FormattedMessage {...messages.tutorials_list_description} />
              </Text>
              <Button size="small" onClick={() => window.Zap.openHelpPage()} mx="auto">
                <FormattedMessage {...messages.tutorials_button_text} />
              </Button>
            </Flex>
          )}
        </Panel.Body>

        <Panel.Footer bg="secondaryColor" p={3} css={{ 'min-height': '160px' }}>
          <Flex
            alignItems="center"
            flexDirection="column"
            justifyContent="center"
            width={9 / 16}
            mx="auto"
          >
            <Text fontWeight="normal" mb={3}>
              <FormattedMessage {...messages.sync_caption} />
            </Text>
            <Heading.h1 mb={2}>{syncMessage}</Heading.h1>
            <Box width={1} css={{ height: '4px' }} bg="grey" mb={2}>
              <Box
                width={syncPercentage ? `${syncPercentage}%` : 0}
                css={{ height: '100%' }}
                bg="lightningOrange"
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
