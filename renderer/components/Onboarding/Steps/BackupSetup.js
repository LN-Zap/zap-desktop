import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { withFieldApi } from 'informed'
import { Flex } from 'rebass'
import { Form, RadioGroup, Heading, Bar } from 'components/UI'
import { BACKUP_FORM_WIDTH, BACKUP_FORM_HEIGHT } from './components/settings'
import BaseBackupTypeItem from './components/BackupTypeItem'
import Container from './components/Container'

import messages from './messages'

const BackupTypeItem = withFieldApi('backupType')(BaseBackupTypeItem)

class BackupSetup extends React.Component {
  static propTypes = {
    setBackupProvider: PropTypes.func.isRequired,
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {},
  }

  handleSubmit = values => {
    const { setBackupProvider } = this.props
    setBackupProvider(values.backupType)
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  render() {
    const { wizardApi, wizardState, setBackupProvider, ...rest } = this.props
    const { getApi, onChange, onSubmit, onSubmitFailure } = wizardApi
    const { currentItem } = wizardState

    return (
      <Container alignItems="center" flexDirection="column" justifyContent="center" mt={3}>
        <Form
          height={BACKUP_FORM_HEIGHT}
          width={BACKUP_FORM_WIDTH}
          {...rest}
          getApi={formApi => {
            this.setFormApi(formApi)
            if (getApi) {
              getApi(formApi)
            }
          }}
          onChange={onChange && (formState => onChange(formState, currentItem))}
          onSubmit={values => {
            this.handleSubmit(values)
            if (onSubmit) {
              onSubmit(values)
            }
          }}
          onSubmitFailure={onSubmitFailure}
        >
          <Heading.h1 mb={3} textAlign="center">
            <FormattedMessage {...messages.backup_header} />
          </Heading.h1>
          <Bar mb={6} />
          <RadioGroup field="backupType" initialValue="local" isRequired name="backupType">
            <Flex alignItems="space-around" justifyContent="center" mt={3}>
              <BackupTypeItem
                label={<FormattedMessage {...messages.backup_type_local} />}
                mb={5}
                mr={3}
                value="local"
                width={1 / 3}
              />
              <BackupTypeItem
                label={<FormattedMessage {...messages.backup_type_gdrive} />}
                mx={5}
                value="gdrive"
                width={1 / 3}
              />

              <BackupTypeItem
                label={<FormattedMessage {...messages.backup_type_dropbox} />}
                mb={5}
                ml={3}
                value="dropbox"
                width={1 / 3}
              />
            </Flex>
          </RadioGroup>
        </Form>
      </Container>
    )
  }
}

export default BackupSetup
