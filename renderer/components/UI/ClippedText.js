import styled from 'styled-components'

import Text from 'components/UI/Text'

const ClippedText = styled(Text)`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export default ClippedText
