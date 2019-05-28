/**
 * genId - Generates a unique id.
 *
 * @returns {string} Unique id
 */
const genId = () =>
  Math.random()
    .toString(36)
    .substring(7)

export default genId
