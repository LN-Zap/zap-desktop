import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { compose } from 'redux'
import { asField } from 'informed'
import { Flex } from 'rebass/styled-components'
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
  const { mode, ...rest } = props
  const [spaceProps, otherProps] = extractSpaceProps(rest)
  return (
    <WithOpenDialog
      render={({ openDialog }) => (
        <Flex alignItems="center" {...spaceProps}>
          <InnerInput width={1} {...otherProps} />
          <OpenDialogButton
            onClick={() => {
              const result = openDialog(mode)
              //set value only if something was selected to avoid
              //overriding an existing state
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
  mode: PropTypes.string,
}

export { OpenDialogInput as BasicOpenDialogInput }

export default compose(
  withInputValidation,
  asField
)(OpenDialogInput)
