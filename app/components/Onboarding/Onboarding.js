import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Isvg from 'react-inlinesvg'
import zapLogo from 'icons/zap_logo.svg'

import FormContainer from './FormContainer'
import Alias from './Alias'
import Syncing from './Syncing'
import styles from './Onboarding.scss'


class Onboarding extends Component {
  render() {
    const {
      onboarding: {
        step,
        alias
      },
      submit,
      aliasProps,
      syncingProps
    } = this.props

    const renderStep = () => {
      switch(step) {
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
          return <Syncing {...syncingProps} />
      }
    }

    return (
      <div className={styles.container}>
        {renderStep()}
      </div>
    )
  }
}

Onboarding.propTypes = {
  syncingProps: PropTypes.object.isRequired
}

export default Onboarding
