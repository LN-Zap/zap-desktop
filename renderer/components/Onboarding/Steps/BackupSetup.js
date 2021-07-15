import React from 'react'

import { withFieldApi } from 'informed'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Flex } from 'rebass/styled-components'

import { intlShape } from '@zap/i18n'
import { Form, RadioGroup } from 'components/Form'
import { Heading, Bar } from 'components/UI'

import BaseBackupTypeItem from './components/BackupTypeItem'
import Container from './components/Container'
import { BACKUP_FORM_WIDTH, BACKUP_FORM_HEIGHT } from './components/settings'
import SkipBackupsDialog from './components/SkipBackupsDialog'
import messages from './messages'

const BackupTypeItem = withFieldApi('backupType')(BaseBackupTypeItem)

class BackupSetup extends React.Component {
  static propTypes = {
    hideSkipBackupDialog: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
    isRestoreMode: PropTypes.bool,
    isSkipBackupDialogOpen: PropTypes.bool,
    setBackupProvider: PropTypes.func.isRequired,
    showError: PropTypes.func.isRequired,
    showSkipBackupDialog: PropTypes.func,
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {},
  }

  componentDidUpdate() {
    const { wizardState, showSkipBackupDialog, isSkipBackupDialogOpen } = this.props
    const { isSkip } = wizardState
    if (isSkip && showSkipBackupDialog && !isSkipBackupDialogOpen) {
      showSkipBackupDialog()
    }
  }

  handleSubmit = values => {
    const { setBackupProvider } = this.props
    setBackupProvider(values.backupType)
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  onCancelSkip = () => {
    const { wizardApi, hideSkipBackupDialog } = this.props
    hideSkipBackupDialog()
    wizardApi.skip(false)
  }

  onSkip = () => {
    const { setBackupProvider, wizardApi, hideSkipBackupDialog, showError, intl } = this.props
    try {
      setBackupProvider(null)
      hideSkipBackupDialog()
      wizardApi.next()
    } catch (e) {
      const message = intl.formatMessage({ ...messages.backup_skip_error })
      showError(`${message}: ${e.message}`)
    }
  }

  render() {
    const { wizardApi, wizardState, isRestoreMode, isSkipBackupDialogOpen } = this.props
    const { getApi, onChange, onSubmit, onSubmitFailure } = wizardApi
    const { currentItem } = wizardState

    return (
      <Container alignItems="center" flexDirection="column" justifyContent="center" mt={3}>
        <Form
          getApi={formApi => {
            this.setFormApi(formApi)
            if (getApi) {
              getApi(formApi)
            }
          }}
          height={BACKUP_FORM_HEIGHT}
          onChange={onChange && (formState => onChange(formState, currentItem))}
          onSubmit={values => {
            this.handleSubmit(values)
            if (onSubmit) {
              onSubmit(values)
            }
          }}
          onSubmitFailure={onSubmitFailure}
          width={BACKUP_FORM_WIDTH}
        >
          <Heading.H1 mb={3} textAlign="center">
            <FormattedMessage
              {...(isRestoreMode ? messages.backup_import_header : messages.backup_header)}
            />
          </Heading.H1>
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
        <SkipBackupsDialog
          isOpen={isSkipBackupDialogOpen}
          isRestoreMode={isRestoreMode}
          onCancel={this.onCancelSkip}
          onSkip={this.onSkip}
          position="fixed"
        />
      </Container>
    )
  }
}

export default injectIntl(BackupSetup)
