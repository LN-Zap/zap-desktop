import React from 'react'
import { Label as Base } from 'styled-system-html'

/**
 * @render react
 * @name Label
 * @example
 * <Label />
 */
class Label extends React.Component {
  static displayName = 'Label'

  render() {
    return (
      <Base css={{ display: 'block' }} color="white" fontWeight="bold" mb={1} {...this.props} />
    )
  }
}

export default Label
