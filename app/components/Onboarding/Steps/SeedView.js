/* eslint-disable react/no-multi-comp */
import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Flex } from 'rebass'
import { Bar, Form, Header, Spinner, Text } from 'components/UI'
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
  word: PropTypes.string.isRequired
}

class SeedView extends React.Component {
  static propTypes = {
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
    seed: PropTypes.array,
    fetchingSeed: PropTypes.bool,
    fetchSeed: PropTypes.func.isRequired
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {},
    seed: [],
    fetchingSeed: false
  }

  async componentDidMount() {
    const { seed, fetchSeed } = this.props
    if (seed.length === 0) {
      fetchSeed()
    }
  }

  render() {
    const { wizardApi, wizardState, seed, fetchSeed, fetchingSeed, intl, ...rest } = this.props
    const { getApi, preSubmit, onSubmit, onSubmitFailure } = wizardApi

    return (
      <Form
        {...rest}
        getApi={getApi}
        preSubmit={preSubmit}
        onSubmit={onSubmit}
        onSubmitFailure={onSubmitFailure}
      >
        <Header
          title={<FormattedMessage {...messages.save_seed_title} />}
          subtitle={<FormattedMessage {...messages.save_seed_description} />}
          align="left"
        />
        <Bar my={4} />

        {fetchingSeed && (
          <Text textAlign="center">
            <Spinner />
            Generating Seed...
          </Text>
        )}
        {!fetchingSeed &&
          seed.length > 0 && (
            <Flex justifyContent="space-between">
              <Flex flexDirection="column" as="ul">
                {seed.slice(0, 6).map((word, index) => (
                  <SeedWord key={index} index={index + 1} word={word} />
                ))}
              </Flex>
              <Flex flexDirection="column" as="ul">
                {seed.slice(6, 12).map((word, index) => (
                  <SeedWord key={index} index={index + 7} word={word} />
                ))}
              </Flex>
              <Flex flexDirection="column" as="ul">
                {seed.slice(12, 18).map((word, index) => (
                  <SeedWord key={index} index={index + 13} word={word} />
                ))}
              </Flex>
              <Flex flexDirection="column" as="ul">
                {seed.slice(18, 24).map((word, index) => (
                  <SeedWord key={index} index={index + 19} word={word} />
                ))}
              </Flex>
            </Flex>
          )}
      </Form>
    )
  }
}

export default injectIntl(SeedView)
