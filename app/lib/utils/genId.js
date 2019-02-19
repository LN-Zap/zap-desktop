/**
 * Generates uniq id.
 */
const genId = () =>
  Math.random()
    .toString(36)
    .substring(7)

export default genId
