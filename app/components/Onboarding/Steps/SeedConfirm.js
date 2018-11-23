import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Flex } from 'rebass'
import { Bar, Form, Header, Input, Label } from 'components/UI'
import messages from './messages'

class SeedConfirm extends React.Component {
  state = {
    seedWordIndexes: []
  }

  static propTypes = {
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
    seed: PropTypes.array.isRequired
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {}
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
    // If the word has been determined as valid, mark the field touched to trigger field highlighting.
    const error = this.validateWord(wordIndex, value)
    if (!error) {
      this.formApi.setTouched(`word${fieldIndex}`, true)
    }
    // Otherwise reset the field state to prevent highlightning as valid.
    else {
      this.formApi.setTouched(`word${fieldIndex}`, false)
      this.formApi.setError(`word${fieldIndex}`, null)
    }
  }

  validateWord = (index, word) => {
    const { seed } = this.props
    return !word || word !== seed[index] ? 'incorrect' : null
  }

  render() {
    const { wizardApi, wizardState, seed, intl, ...rest } = this.props
    const { seedWordIndexes } = this.state
    const { getApi, onChange, preSubmit, onSubmit, onSubmitFailure } = wizardApi
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
        preSubmit={preSubmit}
        onSubmit={onSubmit}
        onSubmitFailure={onSubmitFailure}
      >
        <Header
          title={<FormattedMessage {...messages.retype_seed_title} />}
          subtitle={
            <FormattedMessage
              {...messages.retype_seed_description}
              values={{
                word1: seedWordIndexes[0],
                word2: seedWordIndexes[1],
                word3: seedWordIndexes[2]
              }}
            />
          }
          align="left"
        />

        <Bar my={4} />

        {seedWordIndexes.map((wordIndex, index) => {
          // Only validate if the word has been entered connectly already or the form has been siubmitted.
          return (
            <Flex key={`word${index}`} justifyContent="flex-start" mb={3}>
              <Label htmlFor="alias" width={25} mt={18}>
                {wordIndex}
              </Label>
              <Input
                field={`word${index}`}
                name={`word${index}`}
                validateOnBlur
                validateOnChange
                validate={value => this.validateWord.call(null, wordIndex - 1, value)}
                onChange={e => this.handleWordChange(e.target.value, index, wordIndex - 1)}
                placeholder={intl.formatMessage({ ...messages.word_placeholder })}
                autoFocus={index === 0}
              />
            </Flex>
          )
        })}
      </Form>
    )
  }
}

export default injectIntl(SeedConfirm)
