import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, intlShape, injectIntl } from 'react-intl'
import { Flex } from 'rebass'
import { Bar, Form, Header, Input, Label } from 'components/UI'
import messages from './messages'

class SeedConfirm extends React.Component {
  state = {
    seedWordIndexes: [],
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

  componentDidMount() {
    this.fetchSeedWordIndexes()
  }

  fetchSeedWordIndexes = () => {
    const seedWordIndexes = []
    while (seedWordIndexes.length < 3) {
      const r = Math.floor(Math.random() * 24) + 1
      if (seedWordIndexes.indexOf(r) === -1) {
        seedWordIndexes.push(r)
      }
    }
    this.setState({ seedWordIndexes })
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
    return !word || word !== seed[index] ? 'incorrect' : null
  }

  render() {
    const { wizardApi, wizardState, seed, intl, ...rest } = this.props
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
          align="left"
          subtitle={
            <FormattedMessage
              {...messages.retype_seed_description}
              values={{
                word1: seedWordIndexes[0],
                word2: seedWordIndexes[1],
                word3: seedWordIndexes[2],
              }}
            />
          }
          title={<FormattedMessage {...messages.retype_seed_title} />}
        />

        <Bar my={4} />

        {seedWordIndexes.map((wordIndex, index) => {
          // Only validate if the word has been entered correctly already or the form has been submitted.
          return (
            <Flex key={`word${index}`} justifyContent="flex-start" mb={3}>
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
      </Form>
    )
  }
}

export default injectIntl(SeedConfirm)
