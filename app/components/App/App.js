import React from 'react'
import PropTypes from 'prop-types'

import Form from 'components/Form'
import ChannelForm from 'components/Contacts/ChannelForm'
import Network from 'components/Contacts/Network'
import AddChannel from 'components/Contacts/AddChannel'
import ReceiveModal from 'components/Wallet/ReceiveModal'
import ActivityModal from 'components/Activity/ActivityModal'

import Activity from 'containers/Activity'

import { Box } from 'rebass'
import styles from './App.scss'

class App extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    formProps: PropTypes.object.isRequired,
    closeForm: PropTypes.func.isRequired,
    currentTheme: PropTypes.string.isRequired,
    currentTicker: PropTypes.object,
    contactsFormProps: PropTypes.object,
    networkTabProps: PropTypes.object,
    activityModalProps: PropTypes.object,
    receiveModalProps: PropTypes.object,
    channelFormProps: PropTypes.object,
    fetchInfo: PropTypes.func.isRequired,
    fetchDescribeNetwork: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { fetchInfo, fetchDescribeNetwork } = this.props
    // fetch node info.
    fetchInfo()
    // fetch LN network from nodes POV.
    fetchDescribeNetwork()
  }

  render() {
    const {
      currentTheme,
      currentTicker,
      form,
      formProps,
      closeForm,
      contactsFormProps,
      networkTabProps,
      receiveModalProps,
      activityModalProps,
      channelFormProps
    } = this.props

    if (!currentTicker) {
      return null
    }

    return (
      <Box width={1} className={`${currentTheme}`}>
        <ChannelForm {...channelFormProps} />
        <ReceiveModal {...receiveModalProps} />
        <ActivityModal {...activityModalProps} />
        <Box className={styles.content}>
          <Activity />
        </Box>
        {contactsFormProps.contactsform.isOpen ? (
          <AddChannel {...contactsFormProps} />
        ) : (
          <Network {...networkTabProps} />
        )}
        <Form formType={form.formType} formProps={formProps} closeForm={closeForm} />
      </Box>
    )
  }
}

export default App
