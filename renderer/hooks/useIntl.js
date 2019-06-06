import { useMemo } from 'react'
/**
 * useIntl - Internationalizes select items.
 *
 * @param {Array} items Items
 * @param {Function} messageMapper key=>intl message mapper
 * @param {object} intl Intl
 * @returns {Array} Mapped items
 */
export default function useIntl(items, messageMapper, intl) {
  return useMemo(() => {
    // if messageMapper is not set just original items array
    // in this case items should already contain value prop for each key
    if (!messageMapper) {
      return items
    }
    return items.map(({ key }) => {
      return { key, value: intl.formatMessage({ ...messageMapper(key) }) }
    })
  }, [items, messageMapper, intl])
}
