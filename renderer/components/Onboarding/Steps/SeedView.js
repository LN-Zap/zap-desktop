/* eslint-disable react/no-multi-comp */
import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex } from 'rebass/styled-components'

import { Form, Input } from 'components/Form'
import { Bar, Header, Message, Span, Spinner, Text } from 'components/UI'

import messages from './messages'

const SeedWord = ({ index, word }) => (
  <Text as="li" my={2}>
    <Flex>
      <Text fontWeight="normal" width={25}>
        {index}
      </Text>
      <Text>{word}</Text>
    </Flex>
  </Text>
)
SeedWord.propTypes = {
  index: PropTypes.number.isRequired,
  word: PropTypes.string.isRequired,
}

class SeedView extends React.Component {
  static propTypes = {
    fetchSeed: PropTypes.func.isRequired,
    isFetchingSeed: PropTypes.bool,
    seed: PropTypes.array,
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {},
    seed: [],
  }

  componentDidMount() {
    const { seed, fetchSeed } = this.props
    if (seed.length === 0) {
      fetchSeed()
    }
  }

  componentDidUpdate(prevProps) {
    const { isFetchingSeed, seed } = this.props
    if (seed && seed !== prevProps.seed) {
      this.formApi.setValue('seed', seed)
    }
    if (isFetchingSeed && isFetchingSeed !== prevProps.isFetchingSeed) {
      this.formApi.setValue('seed', null)
      this.formApi.setTouched('seed', true)
    }
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  render() {
    const { wizardApi, wizardState, seed, isFetchingSeed, ...rest } = this.props
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
        width={1}
      >
        {() => (
          <>
            <Header
              subtitle={
                <>
                  <Span fontWeight="normal">
                    <FormattedMessage {...messages.save_seed_description_primary} />
                  </Span>{' '}
                  <FormattedMessage {...messages.save_seed_description_secondary} />
                </>
              }
              title={<FormattedMessage {...messages.save_seed_title} />}
            />
            <Bar my={4} />

            {isFetchingSeed && (
              <Text textAlign="center">
                <Spinner />
                <FormattedMessage {...messages.generating_seed} />
              </Text>
            )}
            {!isFetchingSeed && seed.length > 0 && (
              <>
                <Flex justifyContent="space-between">
                  <Flex as="ul" flexDirection="column">
                    {seed.slice(0, 6).map((word, index) => (
                      <SeedWord index={index + 1} key={index} word={word} />
                    ))}
                  </Flex>
                  <Flex as="ul" flexDirection="column">
                    {seed.slice(6, 12).map((word, index) => (
                      <SeedWord index={index + 7} key={index} word={word} />
                    ))}
                  </Flex>
                  <Flex as="ul" flexDirection="column">
                    {seed.slice(12, 18).map((word, index) => (
                      <SeedWord index={index + 13} key={index} word={word} />
                    ))}
                  </Flex>
                  <Flex as="ul" flexDirection="column">
                    {seed.slice(18, 24).map((word, index) => (
                      <SeedWord index={index + 19} key={index} word={word} />
                    ))}
                  </Flex>
                </Flex>
                <Message justifyContent="center" mt={3} variant="warning">
                  <FormattedMessage {...messages.seed_warning} />
                </Message>
              </>
            )}

            <Input
              field="seed"
              isRequired
              name="seed"
              type="hidden"
              validateOnBlur
              validateOnChange
            />
          </>
        )}
      </Form>
    )
  }
}

export default SeedView
