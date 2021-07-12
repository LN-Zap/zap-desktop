import React, { useRef } from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex } from 'rebass/styled-components'

import { Form, PasswordInput } from 'components/Form'
import ArrowRight from 'components/Icon/ArrowRight'
import ZapLogo from 'components/Icon/ZapLogo'
import { Button, CenteredContent, Message, Text } from 'components/UI'
import { useFormError } from 'hooks'

import messages from './messages'

const Login = ({ login, loginError, clearLoginError, ...rest }) => {
  const formApiRef = useRef(null)

  useFormError(loginError, clearLoginError, formApiRef)

  const handleSubmit = ({ password }) => login(password)

  return (
    <Form
      getApi={api => {
        formApiRef.current = api
      }}
      onSubmit={handleSubmit}
      width={1}
    >
      {({ formState: { submits, error } }) => {
        const willValidateInline = submits > 0
        return (
          <CenteredContent {...rest} mx="auto" width={11 / 16}>
            <Flex alignItems="center" flexDirection="column" px={0} width={5 / 8}>
              <Flex justifyContent="center" mb={4}>
                <ZapLogo height={34} width={34} />
              </Flex>
              <Text mb={4} textAlign="center">
                <FormattedMessage {...messages.intro} />
              </Text>
              {error && (
                <Message mb={3} variant="error">
                  {error}
                </Message>
              )}
              <Flex alignItems="flex-start" width={1}>
                <PasswordInput
                  field="password"
                  hasMessageSpacer
                  isRequired
                  ml={5}
                  validateOnBlur={willValidateInline}
                  validateOnChange={willValidateInline}
                  width={1}
                  willAutoFocus
                />
                <Button ml={2} px={3} type="submit">
                  <ArrowRight />
                </Button>
              </Flex>
            </Flex>
          </CenteredContent>
        )
      }}
    </Form>
  )
}

Login.propTypes = {
  clearLoginError: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  loginError: PropTypes.string,
}

export default Login
