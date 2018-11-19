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
    const { setIsWalletOpen, syncStatus, intl } = this.props
    setIsWalletOpen(true)

    // If we are still waiting for peers after some time, advise te user it could take a wile.
    let timer = setTimeout(() => {
      if (syncStatus === 'waiting') {
        this.setState({
          syncMessageDetail: intl.formatMessage({ ...messages.grab_coffee })
        })
      }
    }, 10000)

    this.setState({ timer })
  }

  componentWillUnmount() {
    const { timer } = this.state
    clearInterval(timer)
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
      if (typeof syncPercentage === 'undefined' || syncPercentage <= 0) {
        syncMessage = intl.formatMessage({ ...messages.preparing })
        syncMessageDetail = null
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

        <Panel.Body width={9 / 16} mx="auto">
          {hasSynced === false &&
            address &&
            address.length && (
              <Flex alignItems="center" flexDirection="column" justifyContent="center">
                <QRCode value={address} mx="auto" />
                <Text my={3}>{address}</Text>
                <Button size="small" onClick={copyClicked} mx="auto">
                  Copy address
                </Button>
              </Flex>
            )}
        </Panel.Body>

        <Panel.Footer bg="secondaryColor" p={3}>
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

            {syncMessageDetail && <Text>{syncMessageDetail}</Text>}
            {syncMessageExtraDetail && <Text>{syncMessageExtraDetail}</Text>}
          </Flex>
        </Panel.Footer>
      </Panel>
    )
  }
}

export default injectIntl(Syncing)
