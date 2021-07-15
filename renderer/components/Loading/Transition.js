import React from 'react'

import PropTypes from 'prop-types'
import { animated, Transition as RPTransition } from 'react-spring/renderprops.cjs'
import styled from 'styled-components'

const AnimationContainer = styled(animated.div)`
  z-index: 1000;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`

const Transition = ({ isLoading, children }) => {
  return (
    <RPTransition
      config={{ duration: 500, delay: 500 }}
      enter={{ opacity: 1 }}
      from={{ opacity: 1 }}
      items={isLoading}
      leave={{ opacity: 0 }}
      native
    >
      {show =>
        show &&
        // eslint-disable-next-line react/display-name
        (springStyles => <AnimationContainer style={springStyles}>{children}</AnimationContainer>)
      }
    </RPTransition>
  )
}

Transition.propTypes = {
  children: PropTypes.node,
  isLoading: PropTypes.bool,
}

export default Transition
