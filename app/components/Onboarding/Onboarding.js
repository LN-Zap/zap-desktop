import React from 'react'
import PropTypes from 'prop-types'

import LoadingBolt from 'components/LoadingBolt'

import FormContainer from './FormContainer'
import Alias from './Alias'
import Autopilot from './Autopilot'
import styles from './Onboarding.scss'

const Onboarding = ({
  onboarding: {
    step,
    alias,
    autopilot
  },
  changeStep,
  submit,
  aliasProps,
  autopilotProps
}) => {
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <FormContainer
            title='1. What should we call you?'
            description='Set your nickname to help others connect with you on the Lightning Network'
            back={null}
            next={() => changeStep(2)}
          >
            <Alias {...aliasProps} />
          </FormContainer>
        )
      case 2:
        return (
          <FormContainer
            title='2. Autopilot'
            description='Autopilot is an automatic network manager. Instead of manually adding people to build your network to make payments, enable autopilot to automatically connect you to the Lightning Network using 60% of your balance.' // eslint-disable-line
            back={() => changeStep(1)}
            next={() => submit(alias, autopilot)}
          >
            <Autopilot {...autopilotProps} />
          </FormContainer>
        )
      default:
        return <LoadingBolt />
    }
  }

  return (
    <div className={styles.container}>
      {renderStep()}
    </div>
  )
}

Onboarding.propTypes = {
  onboarding: PropTypes.object.isRequired,
  aliasProps: PropTypes.object.isRequired,
  autopilotProps: PropTypes.object.isRequired,
  changeStep: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired
}

export default Onboarding
