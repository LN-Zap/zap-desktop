import PropTypes from 'prop-types'

const Truncate = ({ text, maxlen = 12 }) => {
  if (text === null || typeof text === 'undefined' || text === '') {
    return null
  }

  const textString = text.toString()

  const truncatedText =
    textString.length < maxlen
      ? textString
      : textString.substr(0, maxlen / 2) + '...' + textString.substr(textString.length - maxlen / 2)

  return truncatedText
}

Truncate.propTypes = {
  maxlen: PropTypes.number,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default Truncate
