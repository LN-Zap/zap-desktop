import React from 'react'

import bip39 from 'bip39-en'
import Downshift from 'downshift'
import { useFieldApi } from 'informed'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass/styled-components'

import { Input, Label } from 'components/Form'
import { useMaxScreenHeight } from 'hooks'

import SeedWordList from './SeedWordList'

const SeedWordInput = ({ index, onPaste, placeholder, setFormApiFieldValue }) => {
  const inputKey = `word${index}`
  const fieldApi = useFieldApi(inputKey)
  const [measuredRef, maxHeight] = useMaxScreenHeight(300)
  const height = Math.max(maxHeight, 100)

  /**
   * mask - Masks the value with a trimmed version.
   *
   * @param {string} value Value to check
   * @returns {string} Trimmed string
   */
  const mask = value => (value ? value.trim() : value)

  /**
   * validate - Check if a word is included in the bip39 word list.
   *
   * @param {string} value Value to check
   * @returns {string|undefined} undefined if word is in bip39 word list. The string 'incorrect' otherwise
   */
  const validate = value => {
    return bip39.includes(value) ? undefined : 'incorrect'
  }

  /**
   * getValue - Get the current field value.
   *
   * @returns {string} Current field value
   */
  const getValue = () => {
    return fieldApi.getValue() || ''
  }

  /**
   * onChange - Set the current field value.
   *
   * @param {Event} event onChange event
   */
  const onChange = event => {
    fieldApi.setValue(event.target.value)
  }

  return (
    <Downshift onSelect={setFormApiFieldValue}>
      {({
        getInputProps,
        getItemProps,
        getMenuProps,
        getRootProps,
        isOpen,
        inputValue,
        highlightedIndex,
      }) => (
        <Box sx={{ position: 'relative' }} {...getRootProps()}>
          <Flex alignItems="center" as="li" justifyContent="flex-start" my={1}>
            <Label htmlFor={inputKey} mb={0} width={35}>
              {index}
            </Label>
            <Input
              {...getInputProps({
                field: inputKey,
                hasMessage: false,
                highlightOnValid: true,
                onChange,
                mask,
                onPaste,
                placeholder,
                validate,
                validateOnChange: true,
                value: getValue(),
                variant: 'thin',
                willAutoFocus: index === 1,
              })}
            />
          </Flex>
          {isOpen && inputValue && (
            <SeedWordList
              {...{
                getMenuProps,
                highlightedIndex,
                getItemProps,
                inputValue,
              }}
              maxHeight={height}
              ref={measuredRef}
            />
          )}
        </Box>
      )}
    </Downshift>
  )
}

SeedWordInput.propTypes = {
  index: PropTypes.number.isRequired,
  onPaste: PropTypes.func,
  placeholder: PropTypes.string.isRequired,
  setFormApiFieldValue: PropTypes.func.isRequired,
}

export default SeedWordInput
