import React from 'react'
import { List } from 'react-virtualized'
import { space } from 'styled-system'
import styled from 'styled-components'

const ROW_HEIGHT = 53

const StyledList = styled(List)`
  ${space}
  outline: none;
  padding-left: 12px;
`

const ActivityList = React.forwardRef((props, ref) => (
  <StyledList ref={ref} pr={4} rowHeight={ROW_HEIGHT} {...props} />
))

ActivityList.displayName = 'ActivityList'

export default ActivityList
