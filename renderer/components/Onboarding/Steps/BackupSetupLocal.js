import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Form, OpenDialogInput, Heading, Bar } from 'components/UI'
import { BACKUP_FORM_WIDTH, BACKUP_FORM_HEIGHT } from './components/settings'
import Container from './components/Container'
import messages from './messages'

class BackupSetupLocal extends React.Component {
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

  validatePath = () => {
    return true
  }

  handleSubmit = values => {
    const { setBackupPathLocal } = this.props
    setBackupPathLocal(values.path)
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  render() {
    const { wizardApi, wizardState, setBackupPathLocal, ...rest } = this.props
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
          <Heading.h1 mb={3}>
            <FormattedMessage {...messages.backup_header} />
          </Heading.h1>
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
            validateOnBlur
            validateOnChange
            width={1}
          />
        </Form>
      </Container>
    )
  }
}

export default BackupSetupLocal
