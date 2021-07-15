import React, { useState, useEffect } from 'react'

import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import { Flex } from 'rebass/styled-components'

import { intlShape } from '@zap/i18n'
import { Heading, ProgressBar, Text } from 'components/UI'
import { useTimeout } from 'hooks'

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
    } else if (syncStatus === 'in-progress') {
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
  return { caption, mainMessage, extraDetailMessage, detailMessage }
}

const Progress = ({
  blockHeight,
  syncStatus,
  syncPercentage,
  intl,
  neutrinoBlockHeight,
  neutrinoCfilterHeight,
  neutrinoRecoveryHeight,
  recoveryPercentage,
  ...rest
}) => {
  const [syncMessageDetail, setSyncMessageDetail] = useState(null)
  const [syncMessageExtraDetail, setSyncMessageExtraDetail] = useState(null)

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
    <Flex alignItems="center" flexDirection="column" justifyContent="center" {...rest}>
      <Text fontWeight="normal" my={2}>
        {caption}
      </Text>
      <Heading.H1>{mainMessage}</Heading.H1>
      {['in-progress', 'recovering'].includes(syncStatus) && (
        <ProgressBar
          my={2}
          progress={syncStatus === 'in-progress' ? syncPercentage / 100 : recoveryPercentage / 100}
          width={500}
        />
      )}
      <Text>{detailMessage}</Text>
      <Text>{extraDetailMessage}</Text>
    </Flex>
  )
}

Progress.propTypes = {
  blockHeight: PropTypes.number,
  intl: intlShape.isRequired,
  neutrinoBlockHeight: PropTypes.number,
  neutrinoCfilterHeight: PropTypes.number,
  neutrinoRecoveryHeight: PropTypes.number,
  recoveryPercentage: PropTypes.number,
  syncPercentage: PropTypes.number,
  syncStatus: PropTypes.string.isRequired,
}

export default injectIntl(Progress)
