import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.div`
  background-color: var(--warningColor);
  color: var(--black);
  margin-top: 40px;
  padding: 10px;
  border-radius: 4px;
`

/**
 * @render react
 * @name WarningLabel
 * @example
 * <WarningLabel message="Some warning text." />
 */
class WarningLabel extends React.PureComponent {
  static displayName = 'WarningLabel'
  static propTypes = {
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
  }

  render() {
    let { message } = this.props

    return (
      <Wrapper>
        <p>{message}</p>
      </Wrapper>
    )
  }
}

export default WarningLabel
