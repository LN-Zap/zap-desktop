import React from 'react'

const SvgDelete = props => (
  <svg width="1em" height="1em" viewBox="0 0 55 55" {...props}>
    <defs>
      <path
        id="delete_svg__a"
        d="M9 9L0 0l9 9 9-9-7.555 7.555L9 9l1.445 1.445L18 18 9 9l-9 9 9-9z"
      />
    </defs>
    <g fill="none" fillRule="evenodd" transform="translate(1 1)" stroke="currentColor">
      <use
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(18 18)"
        xlinkHref="#delete_svg__a"
      />
      <circle cx={26.5} cy={26.5} r={26.5} />
    </g>
  </svg>
)

export default SvgDelete
