import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { Bar, Panel } from 'components/UI'
import Address from './Address'
import Tutorials from './Tutorials'
import Progress from './Progress'
import NewWalletHeader from './NewWalletHeader'
import OldWalletHeader from './OldWalletHeader'

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
  isLightningGrpcActive,
  network,
  showNotification,
}) => {
  useEffect(() => {
    setIsWalletOpen(true)
  }, [setIsWalletOpen])

  if (isLightningGrpcActive && syncStatus === 'complete') {
    return <Redirect to="/app" />
  }

  return (
    <Panel width={1}>
      <Panel.Header mx="auto" width={9 / 16}>
        {hasSynced ? <OldWalletHeader /> : <NewWalletHeader network={network} />}
        <Bar my={3} />
      </Panel.Header>

      <Panel.Body mb={3} mx="auto" width={9 / 16}>
        {!hasSynced && address && address.length && (
          <Address address={address} css={{ height: '100%' }} showNotification={showNotification} />
        )}
        {hasSynced && <Tutorials css={{ height: '100%' }} />}
      </Panel.Body>

      <Panel.Footer bg="secondaryColor" css={{ 'min-height': '160px' }} p={3}>
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
