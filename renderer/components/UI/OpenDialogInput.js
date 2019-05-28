import React from 'react'
import styled from 'styled-components'
import { compose } from 'redux'
import { asField } from 'informed'
import PropTypes from 'prop-types'
import { withInputValidation, WithOpenDialog } from 'hocs'
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
  return (
    <WithOpenDialog
      render={({ openDialog }) => (
        <InnerInput width={1} {...rest}>
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
        </InnerInput>
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
