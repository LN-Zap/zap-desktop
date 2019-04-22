import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import copy from 'copy-to-clipboard'
import { Box, Flex } from 'rebass'

import { useTimeout } from 'hooks'
import { Bar, Button, Heading, Header, Panel, QRCode, Text, Link } from 'components/UI'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import messages from './messages'

const getSyncMessages = ({
  syncStatus,
  syncPercentage,
  recoveryPercentage,
  neutrinoBlockHeight,
  neutrinoCfilterHeight,
  neutrinoRecoveryHeight,
  blockHeight,
  intl,
  syncMessageExtraDetail,
  syncMessageDetail,
}) => {
  let caption = intl.formatMessage({ ...messages.sync_caption })
  let mainMessage
  let extraDetailMessage = syncMessageExtraDetail
  let detailMessage = syncMessageDetail

  if (syncStatus === 'waiting') {
    mainMessage = intl.formatMessage({ ...messages.waiting_for_peers })
  } else if (['in-progress', 'recovering'].includes(syncStatus)) {
    if (typeof syncPercentage === 'undefined') {
      mainMessage = intl.formatMessage({ ...messages.preparing })
      detailMessage = null
      extraDetailMessage = null
    } else {
      if (syncStatus === 'in-progress') {
        mainMessage = `${syncPercentage}%`
        detailMessage = intl.formatMessage(
          { ...messages.block_progress },
          {
            currentBlock: neutrinoBlockHeight.toLocaleString(),
            totalBlocks: blockHeight.toLocaleString(),
          }
        )
        extraDetailMessage = intl.formatMessage(
          { ...messages.filter_progress },
          {
            currentFilter: neutrinoCfilterHeight.toLocaleString(),
            totalFilters: blockHeight.toLocaleString(),
          }
        )
      } else if (syncStatus === 'recovering') {
        caption = intl.formatMessage({ ...messages.recovery_caption })
        mainMessage = `${recoveryPercentage}%`
        detailMessage = intl.formatMessage(
          { ...messages.filter_progress },
          {
            currentFilter: neutrinoRecoveryHeight.toLocaleString(),
            totalFilters: blockHeight.toLocaleString(),
          }
        )
      }
    }
  }
  return { caption, mainMessage, extraDetailMessage, detailMessage }
}

const Syncing = props => {
  const [syncMessageDetail, setSyncMessageDetail] = useState(null)
  const [syncMessageExtraDetail, setSyncMessageExtraDetail] = useState(null)
  const { setIsWalletOpen, syncStatus, intl } = props

  useEffect(() => {
    setIsWalletOpen(true)
  }, [setIsWalletOpen])

  // clear messages if we are no longer in a waiting state
  useEffect(() => {
    if (syncStatus !== 'waiting') {
      setSyncMessageDetail(null)
      setSyncMessageExtraDetail(null)
    }
  }, [syncStatus])

  // setup message timer if we are in a waiting state or
  // cancel it otherwise by passing null as a delay
  const delay = syncStatus === 'waiting' ? 5000 : null
  useTimeout(() => {
    setSyncMessageDetail(intl.formatMessage({ ...messages.taking_time }))
    setSyncMessageExtraDetail(intl.formatMessage({ ...messages.grab_coffee }))
  }, delay)

  const {
    hasSynced,
    syncPercentage,
    recoveryPercentage,
    address,
    blockHeight,
    neutrinoBlockHeight,
    neutrinoCfilterHeight,
    neutrinoRecoveryHeight,
    isLightningGrpcActive,
    network,
    showNotification,
  } = props

  const copyToClipboard = data => {
    copy(data)
    const notifBody = intl.formatMessage({ ...messages.address_copied_notification_description })
    showNotification(notifBody)
  }

  if (isLightningGrpcActive && syncStatus === 'complete') {
    return <Redirect to="/app" />
  }

  const { caption, mainMessage, extraDetailMessage, detailMessage } = getSyncMessages({
    syncStatus,
    syncPercentage,
    recoveryPercentage,
    neutrinoBlockHeight,
    neutrinoCfilterHeight,
    neutrinoRecoveryHeight,
    blockHeight,
    intl,
    syncMessageExtraDetail,
    syncMessageDetail,
  })

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
            {caption}
          </Text>
          <Heading.h1 mb={2}>{mainMessage}</Heading.h1>
          {syncStatus === 'in-progress' && (
            <Box bg="grey" css={{ height: '4px' }} mb={2} width={1}>
              <Box
                bg="lightningOrange"
                css={{ height: '100%' }}
                width={syncPercentage ? `${syncPercentage}%` : 0}
              />
            </Box>
          )}
          {syncStatus === 'recovering' && (
            <Box bg="grey" css={{ height: '4px' }} mb={2} width={1}>
              <Box
                bg="lightningOrange"
                css={{ height: '100%' }}
                width={recoveryPercentage ? `${recoveryPercentage}%` : 0}
              />
            </Box>
          )}

          <Text>{detailMessage}</Text>
          <Text>{extraDetailMessage}</Text>
        </Flex>
      </Panel.Footer>
    </Panel>
  )
}

Syncing.propTypes = {
  address: PropTypes.string.isRequired,
  blockHeight: PropTypes.number,
  hasSynced: PropTypes.bool,
  intl: intlShape.isRequired,
  isLightningGrpcActive: PropTypes.bool,
  network: PropTypes.string,
  neutrinoBlockHeight: PropTypes.number,
  neutrinoCfilterHeight: PropTypes.number,
  neutrinoRecoveryHeight: PropTypes.number,
  recoveryPercentage: PropTypes.number,
  setIsWalletOpen: PropTypes.func.isRequired,
  showNotification: PropTypes.func.isRequired,
  syncPercentage: PropTypes.number,
  syncStatus: PropTypes.string.isRequired,
}

export default injectIntl(Syncing)
