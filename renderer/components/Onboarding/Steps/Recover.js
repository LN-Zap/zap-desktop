import React, { useRef } from 'react'

import range from 'lodash/range'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Flex } from 'rebass/styled-components'

import { intlShape } from '@zap/i18n'
import parseSeed from '@zap/utils/parseSeed'
import { Form } from 'components/Form'
import { Bar, Header } from 'components/UI'

import SeedWordInput from './components/SeedWordInput'
import messages from './messages'

const getInputKey = idx => `word${idx}`

const Recover = ({ wizardApi, wizardState, setSeed, intl, ...rest }) => {
  const formApiRef = useRef(null)

  const handleSubmit = values => {
    setSeed(Object.values(values))
  }

  const setFormApiFieldValue = (index, word) => {
    const fieldKey = getInputKey(index + 1)
    const formApi = formApiRef.current
    formApi.setValue(fieldKey, word)
    formApi.setTouched(fieldKey, true)
  }

  /**
   * handlePaste - Parse valid seed from the clipboard and use to set values on all inputs.
   *
   * @param {Event} event onPaste event
   */
  const handlePaste = event => {
    const seedWords = parseSeed(event.clipboardData.getData('text'))
    if (seedWords.length === 24) {
      event.preventDefault()
      seedWords.forEach((word, index) => {
        setFormApiFieldValue(index, word)
      })
    }
  }

  const { getApi, onChange, onSubmit, onSubmitFailure } = wizardApi
  const { currentItem } = wizardState
  const indexes = range(24)

  return (
    <Form
      {...rest}
      getApi={formApi => {
        formApiRef.current = formApi
        if (getApi) {
          getApi(formApi)
        }
      }}
      onChange={
        onChange &&
        (formState => {
          onChange(formState, currentItem)
        })
      }
      onSubmit={values => {
        handleSubmit(values)
        if (onSubmit) {
          onSubmit(values)
        }
      }}
      onSubmitFailure={onSubmitFailure}
    >
      <Header
        subtitle={<FormattedMessage {...messages.import_description} />}
        title={<FormattedMessage {...messages.import_title} />}
      />

      <Bar my={4} />

      <Flex justifyContent="space-between">
        {[
          [0, 6],
          [6, 12],
          [12, 18],
          [18, 24],
        ].map((slice, sliceIndex) => (
          <Flex
            as="ul"
            flexDirection="column"
            key={sliceIndex}
            ml={sliceIndex > 0 ? 2 : 0}
            mr={sliceIndex < 3 ? 2 : 0}
          >
            {indexes.slice(...slice).map(index => (
              <SeedWordInput
                index={index + 1}
                key={index + 1}
                onPaste={index === 0 ? handlePaste : null}
                placeholder={intl.formatMessage({ ...messages.word_placeholder })}
                setFormApiFieldValue={word => {
                  setFormApiFieldValue(index, word)
                }}
              />
            ))}
          </Flex>
        ))}
      </Flex>
    </Form>
  )
}

Recover.propTypes = {
  intl: intlShape.isRequired,
  setSeed: PropTypes.func.isRequired,
  wizardApi: PropTypes.object,
  wizardState: PropTypes.object,
}

Recover.defaultProps = {
  wizardApi: {},
  wizardState: {},
}

export default injectIntl(Recover)
