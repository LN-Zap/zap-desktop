import React from 'react'

const SvgDelete = props => (
  <svg height="1em" viewBox="0 0 55 55" width="1em" {...props}>
    <defs>
      <path
        d="M9 9L0 0l9 9 9-9-7.555 7.555L9 9l1.445 1.445L18 18 9 9l-9 9 9-9z"
        id="delete_svg__a"
      />
    </defs>
    <g fill="none" fillRule="evenodd" stroke="currentColor" transform="translate(1 1)">
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
