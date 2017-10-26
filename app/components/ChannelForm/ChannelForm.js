import React from 'react'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal'

import StepOne from './StepOne'
import Footer from './Footer'

import styles from './ChannelForm.scss'

const ChannelForm = ({
  channelform,
  closeChannelForm,
  changeStep,
  setNodeKey,
  channelFormHeader,
  channelFormProgress,
  peers
}) => {
  const renderStep = () => {
    const { step } = channelform
    console.log('setNodeKey: ', setNodeKey)

    switch (step) {
      case 1:
        return <StepOne peers={peers} changeStep={changeStep} setNodeKey={setNodeKey} />
      case 2:
        return 'Step Two'
      case 3:
        return 'Step 3'
      default:
        return 'Confirm Step'
    }
  }
  
  return (
    <ReactModal
      isOpen={channelform.isOpen}
      ariaHideApp
      shouldCloseOnOverlayClick
      contentLabel='No Overlay Click Modal'
      onRequestClose={closeChannelForm}
      parentSelector={() => document.body}
      className={styles.modal}
    >
      <header className={styles.header}>
        <h3>{channelFormHeader}</h3>
        <div className={styles.progress} style={{ width: `${channelFormProgress}%` }}></div>
      </header>

      <div className={styles.content}>
        {renderStep()}
      </div>

      <Footer step={channelform.step} />
    </ReactModal>
  )
}

ChannelForm.propTypes = {}

export default ChannelForm
