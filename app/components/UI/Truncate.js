import PropTypes from 'prop-types'

const Truncate = ({ text, maxlen = 12 }) => {
  if (!text) {
    return null
  }

  const truncatedText =
    text.length < maxlen
      ? text
      : text.substr(0, maxlen / 2) + '...' + text.substr(text.length - maxlen / 2)

  return truncatedText
}

Truncate.propTypes = {
  text: PropTypes.string.isRequired,
  maxlen: PropTypes.number
}

export default Truncate
