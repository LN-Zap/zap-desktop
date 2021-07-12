import React from 'react'

import { asField } from 'informed'
import PropTypes from 'prop-types'
import { Flex } from 'rebass/styled-components'
import { compose } from 'redux'
import styled from 'styled-components'

import { withInputValidation, WithOpenDialog } from 'hocs'
import { extractSpaceProps } from 'themes/util'

import { BasicInput } from './Input'
import OpenDialogButton from './OpenDialogButton'

const InnerInput = styled(BasicInput)`
  input {
    padding-right: 50px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`

const OpenDialogInput = props => {
  const { mode, label, ...rest } = props
  const [spaceProps, otherProps] = extractSpaceProps(rest)
  return (
    <WithOpenDialog
      render={({ openDialog }) => (
        <Flex {...spaceProps}>
          <InnerInput width={1} {...otherProps} label={label} />
          <OpenDialogButton
            mt={label ? 23 : '1px'}
            onClick={async () => {
              const result = await openDialog(mode)
              // set value only if something was selected to avoid
              // overriding an existing state
              if (result) {
                props.fieldApi.setValue(result)
              }
            }}
          />
        </Flex>
      )}
    />
  )
}

OpenDialogInput.propTypes = {
  fieldApi: PropTypes.object.isRequired,
  // electron showOpenDialog feature flags
  // https://electronjs.org/docs/api/dialog
  // options.properties
  label: PropTypes.node,
  mode: PropTypes.string,
}

export { OpenDialogInput as BasicOpenDialogInput }

export default compose(withInputValidation, asField)(OpenDialogInput)
