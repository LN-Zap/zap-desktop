import styled from 'styled-components'
import { variant, space, height } from 'styled-system'

const bars = variant({
  key: 'bars',
})

const Bar = styled.hr`
  height: 1px;
  margin: 0;
  padding: 0;
  border: 0;
  background-color: ${props => props.theme.colors.primaryText};
  ${space}
  ${height}
  ${bars}
`

Bar.defaultProps = {
  variant: 'normal',
}

Bar.displayName = 'Bar'

export default Bar
