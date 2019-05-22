/**
 * truncate - Truncate a string by replacing the middle characters with ...
 *
 * @param {string} text String to truncate
 * @param {number} maxlen Length to truncate to
 * @returns {string} Truncates string
 */
const truncate = (text, maxlen = 100) => {
  if (typeof text === 'string') {
    const truncatedText =
      text.length < maxlen
        ? text
        : text.substr(0, maxlen / 2) + '...' + text.substr(text.length - maxlen / 2)

    return truncatedText
  }
  return text
}

export default truncate
