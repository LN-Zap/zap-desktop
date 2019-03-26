import React from 'react'
import styled from 'styled-components'
import { asField } from 'informed'
import { Flex } from 'rebass'
import { WithOpenDialog } from 'hocs'
import Input from './Input'
import OpenDialogButton from './OpenDialogButton'

const InnerInput = styled(Input)`
  input {
    padding-right: 50px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`

const OpenDialogInput = asField(props => {
  return (
    <WithOpenDialog
      render={({ openDialog }) => (
        <Flex alignItems="center" flexDirection="row" mb={3}>
          <InnerInput width={1} {...props} />
          <OpenDialogButton
            onClick={() => {
              const result = openDialog()
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
})

export default OpenDialogInput
