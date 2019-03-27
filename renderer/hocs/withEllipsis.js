import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

/**
 * A HOC that will applies an overflow and ellipsis to to an element.
 * @param {React.Component} Component Component to wrap
 */
const withEllipsis = Component => {
  const StyledComponent = styled(Component)`
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  `

  return class extends React.Component {
    static displayName = 'withEllipsis'

    static propTypes = {
      children: PropTypes.node,
    }

    render() {
      const { children, ...rest } = this.props

      return <StyledComponent {...rest}>{children}</StyledComponent>
    }
  }
}

export default withEllipsis
