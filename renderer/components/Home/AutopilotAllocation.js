import React from 'react'

import { asField } from 'informed'
import PropTypes from 'prop-types'
import { Flex } from 'rebass/styled-components'

import { BasicRange, BasicInput } from 'components/Form'

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
        field="autopilotAllocation"
        fieldApi={fieldApi}
        fieldState={fieldState}
        id="autopilotAllocation"
        justifyContent="flex-end"
        max="100"
        min="0"
        ml={2}
        step="1"
        textAlign="right"
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
