/* eslint-disable react/no-multi-comp */

import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, intlShape, injectIntl } from 'react-intl'
import bip39 from 'bip39-en'
import { Flex } from 'rebass'
import { Bar, Form, Header, Input, Label } from 'components/UI'
import messages from './messages'

class SeedWord extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    intl: intlShape.isRequired,
    word: PropTypes.string,
  }

  validateWord = value => {
    return !value || !bip39.includes(value) ? 'incorrect' : null
  }

  render() {
    const { index, intl, word } = this.props
    return (
      <Flex key={`word${index}`} alignItems="center" as="li" justifyContent="flex-start" my={1}>
        <Label htmlFor={`word${index}`} mb={0} width={35}>
          {index}
        </Label>
        <Input
          field={`word${index}`}
          hasMessage={false}
          initialValue={word}
          placeholder={intl.formatMessage({ ...messages.word_placeholder })}
          validate={this.validateWord}
          validateOnChange
          variant="thin"
          willAutoFocus={index === 1}
        />
      </Flex>
    )
  }
}

const SeedWordWithIntl = injectIntl(SeedWord)

class Recover extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    seed: PropTypes.array.isRequired,
    setSeed: PropTypes.func.isRequired,
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {},
  }

  handleSubmit = async values => {
    const { setSeed } = this.props
    await setSeed(Object.values(values))
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  render() {
    const { wizardApi, wizardState, seed, setSeed, intl, ...rest } = this.props
    const { getApi, onSubmit, onSubmitFailure } = wizardApi
    const indexes = Array.from(Array(24).keys())

    return (
      <Form
        {...rest}
        getApi={formApi => {
          this.setFormApi(formApi)
          if (getApi) {
            getApi(formApi)
          }
        }}
        onSubmit={async values => {
          await this.handleSubmit(values)
          if (onSubmit) {
            onSubmit(values)
          }
        }}
        onSubmitFailure={onSubmitFailure}
      >
        <Header
          align="left"
          subtitle={<FormattedMessage {...messages.import_description} />}
          title={<FormattedMessage {...messages.import_title} />}
        />

        <Bar my={4} />

        <Flex justifyContent="space-between">
          <Flex as="ul" flexDirection="column" mr={2}>
            {indexes.slice(0, 6).map(word => (
              <SeedWordWithIntl key={word + 1} index={word + 1} word={seed[word]} />
            ))}
          </Flex>
          <Flex as="ul" flexDirection="column" mx={2}>
            {indexes.slice(6, 12).map(word => (
              <SeedWordWithIntl key={word + 1} index={word + 1} word={seed[word]} />
            ))}
          </Flex>
          <Flex as="ul" flexDirection="column" mx={2}>
            {indexes.slice(12, 18).map(word => (
              <SeedWordWithIntl key={word + 1} index={word + 1} word={seed[word]} />
            ))}
          </Flex>
          <Flex as="ul" flexDirection="column" ml={2}>
            {indexes.slice(18, 24).map(word => (
              <SeedWordWithIntl key={word + 1} index={word + 1} word={seed[word]} />
            ))}
          </Flex>
        </Flex>
      </Form>
    )
  }
}

export default injectIntl(Recover)
