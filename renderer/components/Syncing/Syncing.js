import React, { useEffect } from 'react'

import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'

import { Bar, Panel } from 'components/UI'

import Address from './Address'
import NewWalletHeader from './NewWalletHeader'
import OldWalletHeader from './OldWalletHeader'
import Progress from './Progress'
import Tutorials from './Tutorials'

const Syncing = ({
  setIsWalletOpen,
  syncStatus,
  hasSynced,
  syncPercentage,
  recoveryPercentage,
  address,
  blockHeight,
  neutrinoBlockHeight,
  neutrinoCfilterHeight,
  neutrinoRecoveryHeight,
  isAddressLoading,
  isLightningGrpcActive,
  network,
  showNotification,
  ...rest
}) => {
  useEffect(() => {
    setIsWalletOpen(true)
  }, [setIsWalletOpen])

  if (isLightningGrpcActive && syncStatus === 'complete') {
    return <Redirect to="/app" />
  }

  return (
    <Panel width={1} {...rest}>
      <Panel.Header mx="auto" width={9 / 16}>
        {hasSynced ? <OldWalletHeader /> : <NewWalletHeader network={network} />}
        <Bar my={3} />
      </Panel.Header>

      <Panel.Body mb={3} mx="auto" width={9 / 16}>
        {hasSynced ? (
          <Tutorials height="100%" />
        ) : (
          <Address
            address={address}
            height="100%"
            isAddressLoading={isAddressLoading}
            showNotification={showNotification}
          />
        )}
      </Panel.Body>

      <Panel.Footer bg="secondaryColor" minHight={160} p={3}>
        <Progress
          blockHeight={blockHeight}
          mx="auto"
          neutrinoBlockHeight={neutrinoBlockHeight}
          neutrinoCfilterHeight={neutrinoCfilterHeight}
          neutrinoRecoveryHeight={neutrinoRecoveryHeight}
          recoveryPercentage={recoveryPercentage}
          syncPercentage={syncPercentage}
          syncStatus={syncStatus}
          width={9 / 16}
        />
      </Panel.Footer>
    </Panel>
  )
}

Syncing.propTypes = {
  address: PropTypes.string,
  blockHeight: PropTypes.number,
  hasSynced: PropTypes.bool,
  isAddressLoading: PropTypes.bool,
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

export default Syncing
