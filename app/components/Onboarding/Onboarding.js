import React, { Component } from 'react'
import PropTypes from 'prop-types'

import LoadingBolt from 'components/LoadingBolt'

import FormContainer from './FormContainer'
import Alias from './Alias'
import styles from './Onboarding.scss'

const Onboarding = ({
  onboarding: {
    step,
    alias
  },
  submit,
  aliasProps
}) => {
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <FormContainer
            title={'1. What should we call you?'}
            description={'Set your nickname to help others connect with you on the Lightning Network'}
            back={null}
            next={() => submit(alias)}
          >
            <Alias {...aliasProps} />
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
  submit: PropTypes.func.isRequired
}

export default Onboarding
