import React from 'react'
import { Flex } from 'rebass'

import { asField } from 'informed'
import PropTypes from 'prop-types'
import { BasicRange, BasicInput } from 'components/UI'

const AutopilotAllocation = ({ fieldState, fieldApi, sliderWidthNumber }) => {
  return (
    <Flex alignItems="center" justifyContent="flex-end">
      <BasicRange
        field="autopilotAllocation"
        fieldApi={fieldApi}
        fieldState={fieldState}
        id="autopilotAllocation"
        max="100"
        min="0"
        ml="auto"
        sliderWidthNumber={sliderWidthNumber}
        step="1"
      />
      <BasicInput
        css={{ 'text-align': 'right' }}
        field="autopilotAllocation"
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
  sliderWidthNumber: PropTypes.number,
}

export default asField(AutopilotAllocation)
