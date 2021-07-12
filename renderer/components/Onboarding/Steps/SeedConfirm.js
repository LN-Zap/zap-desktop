import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Flex } from 'rebass/styled-components'

import { intlShape } from '@zap/i18n'
import { Form, Input, Label } from 'components/Form'
import { Bar, Header, Span } from 'components/UI'

import messages from './messages'

/**
 * genIndices - Generate a random selection of seed word indexes.
 *
 * @param {number} qty Number of indexes to generate
 * @returns {Array} Array of random seed indexes
 */
const genIndices = qty => {
  const seedWordIndexes = []
  while (seedWordIndexes.length < qty) {
    const r = Math.floor(Math.random() * 24) + 1
    if (seedWordIndexes.indexOf(r) === -1) {
      seedWordIndexes.push(r)
    }
  }
  return seedWordIndexes
}

class SeedConfirm extends React.Component {
  state = {
    seedWordIndexes: genIndices(3),
  }

  static propTypes = {
    intl: intlShape.isRequired,
    seed: PropTypes.array.isRequired,
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {},
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  handleWordChange = (value, fieldIndex, wordIndex) => {
    const error = this.validateWord(wordIndex, value)
    // reset the field state to prevent highlighting as valid.
    if (error) {
      this.formApi.setTouched(`word${fieldIndex}`, false)
      this.formApi.setError(`word${fieldIndex}`, null)
    }
    // Otherwise the word has been determined as valid, mark the field touched to trigger field highlighting.
    else {
      this.formApi.setTouched(`word${fieldIndex}`, true)
    }
  }

  validateWord = (index, word) => {
    const { seed } = this.props
    return !word || word !== seed[index] ? 'incorrect' : undefined
  }

  render() {
    const { wizardApi, wizardState, intl, ...rest } = this.props
    const { seedWordIndexes } = this.state
    const { getApi, onChange, onSubmit, onSubmitFailure } = wizardApi
    const { currentItem } = wizardState

    return (
      <Form
        {...rest}
        getApi={formApi => {
          this.setFormApi(formApi)
          if (getApi) {
            getApi(formApi)
          }
        }}
        onChange={onChange && (formState => onChange(formState, currentItem))}
        onSubmit={onSubmit}
        onSubmitFailure={onSubmitFailure}
      >
        <Header
          subtitle={
            <>
              <Span fontWeight="normal">
                <FormattedMessage {...messages.retype_seed_description_primary} />
              </Span>{' '}
              <FormattedMessage
                {...messages.retype_seed_description_secondary}
                values={{
                  word1: seedWordIndexes[0],
                  word2: seedWordIndexes[1],
                  word3: seedWordIndexes[2],
                }}
              />
            </>
          }
          title={<FormattedMessage {...messages.retype_seed_title} />}
        />

        <Bar my={4} />

        <Flex alignItems="center" flexDirection="column">
          {seedWordIndexes.map((wordIndex, index) => {
            // Only validate if the word has been entered correctly already or the form has been submitted.
            return (
              <Flex justifyContent="flex-start" key={`word${index}`} mb={3}>
                <Label htmlFor="alias" mt={18} width={25}>
                  {wordIndex}
                </Label>
                <Input
                  field={`word${index}`}
                  name={`word${index}`}
                  onChange={e => this.handleWordChange(e.target.value, index, wordIndex - 1)}
                  placeholder={intl.formatMessage({ ...messages.word_placeholder })}
                  validate={value => this.validateWord.call(null, wordIndex - 1, value)}
                  validateOnBlur
                  validateOnChange
                  willAutoFocus={index === 0}
                />
              </Flex>
            )
          })}
        </Flex>
      </Form>
    )
  }
}

export default injectIntl(SeedConfirm)
