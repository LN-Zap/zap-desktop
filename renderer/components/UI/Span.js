import styled from 'styled-components'
import { space, layout, color, typography, compose } from 'styled-system'

const Span = styled('span')(
  compose(
    space,
    layout,
    color,
    typography
  )
)

export default Span
