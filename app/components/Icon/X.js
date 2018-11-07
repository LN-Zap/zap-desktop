import React from 'react'

const SvgX = props => (
  <svg width="1em" height="1em" viewBox="0 0 22 20" {...props}>
    <defs>
      <path
        id="x_svg__a"
        d="M10 10L0 20l10-10L0 0l10 10L20 0l-8.394 8.394L10 10l1.606 1.606L20 20 10 10z"
      />
    </defs>
    <use
      fill="none"
      fillRule="evenodd"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(1)"
      xlinkHref="#x_svg__a"
    />
  </svg>
)

export default SvgX
