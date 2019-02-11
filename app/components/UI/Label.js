import React from 'react'
import system from '@rebass/components'
import { styles } from 'styled-system'

// Create an html input element that accepts all style props from styled-system.
const SystemLabel = system(
  {
    as: 'label',
    display: 'block',
    color: 'primaryText',
    fontSize: 'm',
    fontWeight: 'normal',
    mb: 1
  },
  ...Object.keys(styles)
)

/**
 * @render react
 * @name Label
 * @example
 * <Label />
 */
class Label extends React.PureComponent {
  static displayName = 'Label'

  render() {
    return <SystemLabel {...this.props} />
  }
}

export default Label
