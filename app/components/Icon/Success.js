import React from 'react'

const SvgSuccess = props => (
  <svg height="1em" viewBox="0 0 17 17" width="1em" {...props}>
    <defs>
      <path
        d="M8.333 16.667A8.333 8.333 0 1 1 8.333 0a8.333 8.333 0 0 1 0 16.667zM11.095 5.66l-4.41 4.41-1.513-1.51a.833.833 0 1 0-1.179 1.178l2.101 2.101a.833.833 0 0 0 1.179 0l5-5a.833.833 0 0 0-1.179-1.178z"
        id="success_svg__a"
      />
    </defs>
    <use fill="currentColor" fillRule="evenodd" xlinkHref="#success_svg__a" />
  </svg>
)

export default SvgSuccess
