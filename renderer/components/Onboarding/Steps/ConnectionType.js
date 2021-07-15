import React from 'react'

import { withFieldApi } from 'informed'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Box, Flex } from 'rebass/styled-components'
import styled from 'styled-components'

import { Form, RadioGroup } from 'components/Form'
import ZapLogo from 'components/Icon/ZapLogo'

import BaseConnectionTypeItem from './components/ConnectionTypeItem'
import BaseContainer from './components/Container'
import messages from './messages'

const Container = styled(BaseContainer)`
  visibility: ${props => (props.lndConnect ? 'hidden' : 'visible')};
`

const ConnectionTypeItem = withFieldApi('connectionType')(BaseConnectionTypeItem)

class ConnectionType extends React.Component {
  static propTypes = {
    connectionType: PropTypes.string,
    lndConnect: PropTypes.string,
    resetOnboarding: PropTypes.func.isRequired,
    setConnectionType: PropTypes.func.isRequired,
    stopLnd: PropTypes.func.isRequired,
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {},
  }

  componentDidMount() {
    const { lndConnect, resetOnboarding, stopLnd } = this.props
    stopLnd()
    if (lndConnect) {
      this.formApi.setValue('connectionType', 'custom')
      this.formApi.submitForm()
    } else {
      resetOnboarding()
    }
  }

  componentDidUpdate(prevProps) {
    const { lndConnect } = this.props
    if (lndConnect && lndConnect !== prevProps.lndConnect) {
      this.formApi.setValue('connectionType', 'custom')
      this.formApi.submitForm()
    }
  }

  handleSubmit = values => {
    const { setConnectionType } = this.props
    setConnectionType(values.connectionType)
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  render() {
    const { wizardApi, wizardState, connectionType, lndConnect, ...rest } = this.props
    const { getApi, onChange, onSubmit, onSubmitFailure } = wizardApi
    const { currentItem } = wizardState

    return (
      <Container
        alignItems="center"
        flexDirection="column"
        justifyContent="center"
        lndConnect={lndConnect}
      >
        <Box mb={6}>
          <ZapLogo height={56} width={56} />
        </Box>

        <Form
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
          <RadioGroup
            field="connectionType"
            initialValue={connectionType}
            isRequired
            name="connectionType"
          >
            <Flex alignItems="space-around" justifyContent="center" mt={3}>
              <ConnectionTypeItem
                description={<FormattedMessage {...messages.connection_type_create_description} />}
                label={<FormattedMessage {...messages.connection_type_create_label} />}
                mb={5}
                mr={3}
                value="create"
                width={1 / 3}
              />
              <ConnectionTypeItem
                description={<FormattedMessage {...messages.connection_type_custom_description} />}
                label={<FormattedMessage {...messages.connection_type_custom_label} />}
                mx={5}
                value="custom"
                width={1 / 3}
              />
              <ConnectionTypeItem
                description={<FormattedMessage {...messages.connection_type_import_description} />}
                label={<FormattedMessage {...messages.connection_type_import_label} />}
                mb={5}
                ml={3}
                value="import"
                width={1 / 3}
              />
            </Flex>
          </RadioGroup>
        </Form>
      </Container>
    )
  }
}

export default ConnectionType
