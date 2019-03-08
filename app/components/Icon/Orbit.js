import React from 'react'

const SvgOrbit = props => (
  <svg viewBox="0 0 200 200" {...props} height="1em" width="1em">
    <g transform="rotate(135 100 100)">
      <circle cx={20} cy={100} fill="#fd9800" r={15} />
      <path
        d="M43.716 156.854c44.22 44.218 116.627 22.346 134.01-35.695 15.845-59.58-38.821-114.247-98.4-98.4A79.752 79.752 0 0 0 43.43 43.432"
        fill="none"
        paintOrder="stroke"
        stroke="#fff"
        strokeLinecap="round"
        strokeWidth={2.8}
      />
    </g>
    <g transform="rotate(9.999 -130.687 272.785) scale(.65141)">
      <circle cx={21.478} cy={96.049} fill="#fd9800" r={15.351} />
      <path
        d="M45.371 153.325c44.547 44.547 117.494 22.512 135.005-35.96 15.964-60.023-39.109-115.096-99.13-99.132a80.34 80.34 0 0 0-36.162 20.828"
        fill="none"
        paintOrder="stroke"
        stroke="#fff"
        strokeLinecap="round"
        strokeWidth={7.369}
      />
    </g>
    <g transform="matrix(-.12289 -.33764 .33672 -.12255 83.046 146.287)">
      <circle cx={28.276} cy={88.641} fill="#fd9800" r={13.916} />
      <path
        d="M105.092 165.386c59.827 0 94.188-63.953 66.822-115.117-29.446-51.163-103.409-51.163-133.133 0A76.826 76.826 0 0 0 28.38 88.644"
        fill="none"
        paintOrder="stroke"
        stroke="#fff"
        strokeLinecap="round"
        strokeWidth={7.803}
        transform="matrix(.70708 .70906 -.7052 .70708 93.242 -48.428)"
      />
    </g>
  </svg>
)

export default SvgOrbit
