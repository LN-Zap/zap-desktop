/* eslint-disable react/no-multi-comp */

import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import bip39 from 'bip39-en'
import { Flex } from 'rebass'
import { Bar, Form, Header, Input, Label } from 'components/UI'
import messages from './messages'

class SeedWord extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    intl: PropTypes.object.isRequired,
    word: PropTypes.string
  }

  validateWord = value => {
    return !value || !bip39.includes(value) ? 'incorrect' : null
  }

  render() {
    const { index, intl, word } = this.props
    return (
      <Flex key={`word${index}`} justifyContent="flex-start" alignItems="center" as="li" my={1}>
        <Label htmlFor={`word${index}`} width={35} mb={0}>
          {index}
        </Label>
        <Input
          autoFocus={index === 1}
          initialValue={word}
          field={`word${index}`}
          validate={this.validateWord}
          variant="thin"
          validateOnChange
          placeholder={intl.formatMessage({ ...messages.word_placeholder })}
          showMessage={false}
        />
      </Flex>
    )
  }
}

const SeedWordWithIntl = injectIntl(SeedWord)

class SeedView extends React.Component {
  static propTypes = {
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
    seed: PropTypes.array.isRequired
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {}
  }

  render() {
    const { wizardApi, wizardState, seed, intl, ...rest } = this.props
    const { getApi, preSubmit, onSubmit, onSubmitFailure } = wizardApi
    const indexes = Array.from(Array(24).keys())

    return (
      <Form
        {...rest}
        getApi={getApi}
        preSubmit={preSubmit}
        onSubmit={onSubmit}
        onSubmitFailure={onSubmitFailure}
      >
        <Header
          title={<FormattedMessage {...messages.import_title} />}
          subtitle={<FormattedMessage {...messages.import_description} />}
          align="left"
        />

        <Bar my={4} />

        <Flex justifyContent="space-between">
          <Flex flexDirection="column" as="ul" mr={2}>
            {indexes.slice(0, 6).map(word => (
              <SeedWordWithIntl key={word + 1} index={word + 1} word={seed[word]} />
            ))}
          </Flex>
          <Flex flexDirection="column" as="ul" mx={2}>
            {indexes.slice(6, 12).map(word => (
              <SeedWordWithIntl key={word + 1} index={word + 1} word={seed[word]} />
            ))}
          </Flex>
          <Flex flexDirection="column" as="ul" mx={2}>
            {indexes.slice(12, 18).map(word => (
              <SeedWordWithIntl key={word + 1} index={word + 1} word={seed[word]} />
            ))}
          </Flex>
          <Flex flexDirection="column" as="ul" ml={2}>
            {indexes.slice(18, 24).map(word => (
              <SeedWordWithIntl key={word + 1} index={word + 1} word={seed[word]} />
            ))}
          </Flex>
        </Flex>
      </Form>
    )
  }
}

export default injectIntl(SeedView)
