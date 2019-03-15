import React from 'react'
import { Flex } from 'rebass'

import { asField } from 'informed'
import PropTypes from 'prop-types'
import { BasicRange, BasicInput } from 'components/UI'

const AutopilotAllocation = ({ fieldState, fieldApi, initialValue, sliderWidthNumber }) => {
  return (
    <Flex alignItems="center" justifyContent="flex-end">
      <BasicRange
        fieldApi={fieldApi}
        fieldState={fieldState}
        id="autopilotAllocation"
        initialValue={initialValue}
        max="100"
        min="0"
        ml="auto"
        sliderWidthNumber={sliderWidthNumber}
        step="1"
      />
      <BasicInput
        css={{ 'text-align': 'right' }}
        fieldApi={fieldApi}
        fieldState={fieldState}
        id="autopilotAllocation"
        justifyContent="right"
        max="100"
        min="0"
        ml={2}
        step="1"
        type="number"
        width={70}
      />
    </Flex>
  )
}

AutopilotAllocation.propTypes = {
  fieldApi: PropTypes.object.isRequired,
  fieldState: PropTypes.object.isRequired,
  initialValue: PropTypes.object.isRequired,
  sliderWidthNumber: PropTypes.number,
}

export default asField(AutopilotAllocation)
