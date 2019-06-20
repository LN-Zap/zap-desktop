/**
 * returns unix time
 *
 * @returns {number}
 */
export default function getUnixTime() {
  const date = new Date()
  return date.getTime()
}
