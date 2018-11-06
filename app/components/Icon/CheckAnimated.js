import React from 'react'

const SvgCheckAnimated = props => (
  <svg
    className="check-animated_svg__checkmark"
    viewBox="0 0 52 52"
    {...props}
    width="1em"
    height="1em"
  >
    <circle className="check-animated_svg__checkmark__circle" cx={26} cy={26} r={25} fill="none" />
    <path
      className="check-animated_svg__checkmark__check"
      fill="none"
      d="M14.1 27.2l7.1 7.2 16.7-16.8"
    />
  </svg>
)

export default SvgCheckAnimated
