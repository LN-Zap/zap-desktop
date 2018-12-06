import system from '@rebass/components'

const Bar = system(
  {
    is: 'hr',
    m: 0,
    border: 0,
    borderBottom: 1,
    borderColor: 'primaryText',
    opacity: 0.6
  },
  'borders',
  'borderColor',
  'space',
  'opacity',
  'width'
)

Bar.displayName = 'Bar'

export default Bar
