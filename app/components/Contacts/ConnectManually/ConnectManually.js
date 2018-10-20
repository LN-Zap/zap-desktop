import React from 'react'
import PropTypes from 'prop-types'

import { FormattedMessage, injectIntl } from 'react-intl'
import { Button } from 'components/UI'
import messages from './messages'

import styles from './ConnectManually.scss'

class ConnectManually extends React.Component {
  render() {
    const {
      manualSearchQuery,

      manualFormIsValid,
      updateManualFormErrors,

      openSubmitChannelForm,
      updateManualFormSearchQuery,

      setNode,

      showErrors,
      intl
    } = this.props

    const formSubmitted = () => {
      if (!manualFormIsValid.isValid) {
        updateManualFormErrors(manualFormIsValid.errors)

        return
      }
      // clear any existing errors
      updateManualFormErrors({ manualInput: null })

      const [pub_key, addr] = manualSearchQuery && manualSearchQuery.split('@')

      // the SubmitChannel component is expecting a node object that looks like the following
      // {
      //    pub_key: 'some_string',
      //    addresses: [
      //      {
      //        addr: 'some_host_address'
      //      }
      //    ]
      // }
      // knowing this we will set the node object with the known format and plug in the pubkey + host accordingly
      setNode({ pub_key, addresses: [{ addr }] })

      // now we close the ConnectManually form and open the SubmitChannel form by chaning the channelFormType
      openSubmitChannelForm()
    }

    return (
      <div className={styles.content}>
        <header className={styles.header}>
          <h1>
            <FormattedMessage {...messages.title} />
          </h1>
          <p>
            <FormattedMessage {...messages.description} />
          </p>
        </header>

        <section className={styles.peer}>
          <div className={styles.input}>
            <input
              type="text"
              placeholder={intl.formatMessage({ ...messages.placeholder })}
              value={manualSearchQuery}
              onChange={event => updateManualFormSearchQuery(event.target.value)}
            />
          </div>
        </section>

        <section
          className={`${styles.errorMessage} ${showErrors.manualInput ? styles.active : undefined}`}
        >
          {showErrors.manualInput && (
            <span>{manualFormIsValid && manualFormIsValid.errors.manualInput}</span>
          )}
        </section>

        <section className={styles.submit}>
          <Button disabled={!manualFormIsValid.isValid} onClick={formSubmitted} size="large">
            <FormattedMessage {...messages.submit} />
          </Button>
        </section>
      </div>
    )
  }
}

ConnectManually.propTypes = {
  manualSearchQuery: PropTypes.string.isRequired,

  manualFormIsValid: PropTypes.object.isRequired,
  updateManualFormErrors: PropTypes.func.isRequired,

  openSubmitChannelForm: PropTypes.func.isRequired,
  updateManualFormSearchQuery: PropTypes.func.isRequired,

  setNode: PropTypes.func.isRequired,

  showErrors: PropTypes.object.isRequired
}

export default injectIntl(ConnectManually)
