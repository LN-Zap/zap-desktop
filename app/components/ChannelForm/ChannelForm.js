import React from 'react'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal'

import { FaClose } from 'react-icons/lib/fa'

import StepOne from './StepOne'
import StepTwo from './StepTwo'
import StepThree from './StepThree'
import StepFour from './StepFour'
import Footer from './Footer'

import styles from './ChannelForm.scss'

const ChannelForm = ({
  channelform,
  openChannel,
  closeChannelForm,
  changeStep,
  setNodeKey,
  setLocalAmount,
  setPushAmount,
  channelFormHeader,
  channelFormProgress,
  stepTwoIsValid,
  peers
}) => {
  const renderStep = () => {
    const { step } = channelform

    switch (step) {
      case 1:
        return <StepOne peers={peers} changeStep={changeStep} setNodeKey={setNodeKey} />
      case 2:
        return <StepTwo local_amt={channelform.local_amt} setLocalAmount={setLocalAmount} />
      case 3:
        return <StepThree push_amt={channelform.push_amt} setPushAmount={setPushAmount} />
      default:
        return <StepFour node_key={channelform.node_key} local_amt={channelform.local_amt} push_amt={channelform.push_amt} />
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
      <div onClick={closeChannelForm} className={styles.modalClose}>
        <FaClose className={styles.close} />
      </div>

      <header className={styles.header}>
        <h3>{channelFormHeader}</h3>
        <div className={styles.progress} style={{ width: `${channelFormProgress}%` }} />
      </header>

      <div className={styles.content}>
        {renderStep()}
      </div>

      <Footer
        step={channelform.step}
        changeStep={changeStep}
        stepTwoIsValid={stepTwoIsValid}
        submit={() => openChannel({ pubkey: channelform.node_key, local_amt: channelform.local_amt, push_amt: channelform.push_amt })}
      />
    </ReactModal>
  )
}

ChannelForm.propTypes = {
  channelform: PropTypes.object.isRequired,
  openChannel: PropTypes.func.isRequired,
  closeChannelForm: PropTypes.func.isRequired,
  changeStep: PropTypes.func.isRequired,
  setNodeKey: PropTypes.func.isRequired,
  setLocalAmount: PropTypes.func.isRequired,
  setPushAmount: PropTypes.func.isRequired,
  channelFormHeader: PropTypes.string.isRequired,
  channelFormProgress: PropTypes.number.isRequired,
  stepTwoIsValid: PropTypes.bool.isRequired,
  peers: PropTypes.array.isRequired
}

export default ChannelForm
