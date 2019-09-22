import React from 'react'
import PropTypes from 'prop-types'
import bip39 from 'bip39-en'
import { Box, Flex } from 'rebass/styled-components'
import { Text } from 'components/UI'

/**
 * Create a mapping of first letter to words in BIP 39 list so
 * we don't have to filter through the whole array when looking up values
 * every time
 */
const bip39WordMap = bip39.reduce((bip39WordMap, word) => {
  const [firstLetter] = word
  if (!bip39WordMap[firstLetter]) {
    bip39WordMap[firstLetter] = []
  }

  bip39WordMap[firstLetter].push(word)

  return bip39WordMap
}, {})

const StyledOptionList = React.forwardRef((props, ref) => (
  <Box
    ref={ref}
    as="ul"
    bg="secondaryColor"
    maxHeight={300}
    mt={1}
    p={0}
    sx={{
      position: 'absolute',
      zIndex: 2,
      overflowY: 'auto',
      overflowX: 'hidden',
      outline: 0,
      transition: 'opacity 0.1s ease',
      borderRadius: 's',
      boxShadow: 's',
    }}
    width={1}
    {...props}
  />
))
StyledOptionList.displayName = 'StyledOptionList'

const SeedWordList = props => {
  const { highlightedIndex, getItemProps, getMenuProps, inputValue } = props

  // Don't show suggestions if user didn't input anything
  if (!inputValue) {
    return null
  }

  // Get the wordlist we can suggest
  const [firstLetter] = inputValue
  const suggestions = bip39WordMap[firstLetter]
  if (!suggestions) {
    return null
  }

  // Get the words that match the input
  const wordList = suggestions.filter(word => word.indexOf(inputValue) === 0)

  // Input doesn't match anything, show nothing
  if (!wordList.length) {
    return null
  }

  // We have one suugestion only and it matches the input exactly.
  // No point to annoy the user by showing exactly the same thing so
  // we don't show this single suggestion.
  if (wordList.length === 1 && wordList[0] === inputValue) {
    return null
  }

  return (
    <StyledOptionList {...getMenuProps({}, { suppressRefError: true })}>
      {wordList.map((item, index) => (
        <Flex
          {...getItemProps({
            index,
            item,
          })}
          key={item}
          alignItems="center"
          as="li"
          bg={highlightedIndex === index ? 'primaryColor' : null}
          p={2}
          sx={{
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <Text>{item}</Text>
        </Flex>
      ))}
    </StyledOptionList>
  )
}

SeedWordList.propTypes = {
  getItemProps: PropTypes.func.isRequired,
  getMenuProps: PropTypes.func.isRequired,
  highlightedIndex: PropTypes.number,
  inputValue: PropTypes.string.isRequired,
}

export default SeedWordList
