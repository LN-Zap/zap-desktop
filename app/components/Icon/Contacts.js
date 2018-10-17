import React from 'react'

const SvgContacts = props => (
  <svg viewBox="0 0 20 15" width="1em" height="1em" {...props}>
    <g
      transform="translate(1 1)"
      stroke="currentColor"
      strokeWidth={0.8}
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13.5 14v-1.458c0-1.611-1.511-2.917-3.375-2.917h-6.75C1.511 9.625 0 10.931 0 12.542V14" />
      <ellipse cx={6.75} cy={3.063} rx={3.15} ry={3.063} />
      <path d="M18 14v-1.49c-.001-1.36-1.112-2.545-2.7-2.885M12.6 0c1.589.358 2.7 1.619 2.7 3.063 0 1.443-1.111 2.704-2.7 3.062" />
    </g>
  </svg>
)

export default SvgContacts
