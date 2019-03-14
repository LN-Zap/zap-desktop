import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass'
import { Bar, DataRow, Heading, Button, Range, Form, Panel, Text } from 'components/UI'
import { CryptoValue, CryptoSelector, FiatValue } from 'containers/UI'
import { Truncate } from 'components/Util'

const AutopayCreateForm = props => {
  const { merchantNickname, merchantName, pubkey, ...rest } = props

  return (
    <Form {...rest}>
      {({ formState }) => {
        const { limit = 0 } = formState.values
        const min = 0
        const max = 1500000
        const defaultValue = 150000

        return (
          <Panel>
            <Panel.Header>
              <Heading.h1 textAlign="center">{`Add ${merchantNickname} to autopay`}</Heading.h1>
              <Bar my={2} />
            </Panel.Header>
            <Panel.Body>
              <DataRow
                left={
                  <>
                    <Flex justifyContent="space-between">
                      <Text fontWeight="normal">Range</Text>
                      <Text color="gray" fontWeight="light">
                        max. <FiatValue style="currency" value={max} />
                      </Text>
                    </Flex>
                    <Range
                      field="limit"
                      initialValue={defaultValue}
                      max={max}
                      min={min}
                      sliderWidthNumber={350}
                    />
                  </>
                }
                right={
                  <Flex alignItems="flex-end" flexDirection="column">
                    <Flex alignItems="baseline">
                      <CryptoValue fontSize="xxl" value={limit} />
                      <CryptoSelector ml={2} />
                    </Flex>
                    <Flex alignItems="baseline">
                      <Text color="gray">=</Text>
                      <FiatValue color="gray" style="currency" value={limit} />
                    </Flex>
                  </Flex>
                }
              />
              <Bar variant="light" />
              <DataRow left="Name" right={merchantName} />
              <Bar variant="light" />
              <DataRow left="Remote PubKey" right={<Truncate maxlen={40} text={pubkey} />} />
              <Bar variant="light" />
            </Panel.Body>
            <Panel.Footer mt={3}>
              <Flex justifyContent="center">
                <Button variant="primary">Add to autopay</Button>
              </Flex>
            </Panel.Footer>
          </Panel>
        )
      }}
    </Form>
  )
}

AutopayCreateForm.propTypes = {
  merchantName: PropTypes.string.isRequired,
  merchantNickname: PropTypes.string.isRequired,
  pubkey: PropTypes.string.isRequired,
}

export default AutopayCreateForm
