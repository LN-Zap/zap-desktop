/**
 * extractSpaceProps - Extract styled-system space props.
 *
 * @param  {object} props Props
 * @returns {Array} An array containig all space props, and an array containing everything else.
 */
const extractSpaceProps = props => {
  const space = [
    'mt',
    'mb',
    'ml',
    'mr',
    'pt',
    'pb',
    'pl',
    'pr',
    'mx',
    'my',
    'px',
    'py',
    'm',
    'p',
    'width',
  ]
  const spaceProps = {}
  const otherProps = {}
  Object.keys(props).forEach(key => {
    const isSpaceProp = space.includes(key)
    if (isSpaceProp) {
      spaceProps[key] = props[key]
    } else {
      otherProps[key] = props[key]
    }
  })
  return [spaceProps, otherProps]
}

export default extractSpaceProps
