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
    width: 1,
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
    const { readOnly } = this.props
    return <SystemLabel {...this.props} opacity={readOnly ? 0.6 : null} />
  }
}

export default Label
