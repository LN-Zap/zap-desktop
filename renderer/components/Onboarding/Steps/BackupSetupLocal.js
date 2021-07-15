import React from 'react'

import debounce from 'lodash/debounce'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'

import { intlShape } from '@zap/i18n'
import { Form, OpenDialogInput } from 'components/Form'
import { Heading, Bar } from 'components/UI'

import Container from './components/Container'
import { BACKUP_FORM_WIDTH, BACKUP_FORM_HEIGHT } from './components/settings'
import messages from './messages'

class BackupSetupLocal extends React.Component {
  validatePath = debounce(async () => {
    const { intl } = this.props
    const value = this.formApi.getValue('path')
    if (!value) {
      return
    }
    const dirExists = await window.Zap.dirExists(value)
    if (dirExists) {
      this.formApi.setError('path', undefined)
    } else {
      this.formApi.setError('path', intl.formatMessage({ ...messages.backup_dir_not_exist }))
    }
  }, 300)

  static propTypes = {
    intl: intlShape.isRequired,
    setBackupPathLocal: PropTypes.func.isRequired,
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {},
  }

  handleSubmit = values => {
    const { setBackupPathLocal } = this.props
    setBackupPathLocal(values.path)
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  render() {
    const { wizardApi, wizardState, ...rest } = this.props
    const { getApi, onChange, onSubmit, onSubmitFailure } = wizardApi
    const { currentItem } = wizardState

    return (
      <Container alignItems="center" flexDirection="column" justifyContent="center" mt={3}>
        <Form
          asyncValidators={[this.validatePath]}
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
          <Heading.H1 mb={3} textAlign="center">
            <FormattedMessage {...messages.backup_header} />
          </Heading.H1>
          <Bar mb={4} />
          <OpenDialogInput
            description={<FormattedMessage {...messages.backup_path_description} />}
            field="path"
            isRequired
            label={<FormattedMessage {...messages.backup_path_label} />}
            mb={3}
            mode="openDirectory"
            name="path"
            onBlur={this.validatePath}
            onChange={this.validatePath}
            validateOnBlur
            width={1}
          />
        </Form>
      </Container>
    )
  }
}

export default injectIntl(BackupSetupLocal)
