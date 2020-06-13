import { useMemo } from 'react'
/**
 * useIntlMap - Internationalizes select items.
 *
 * @param {{ key:string, value:string? }[]} items Items
 * @param {Function} messageMapper key=>intl message mapper
 * @param {object} intl Intl
 * @returns {{ key:string }[]} Mapped items
 */
export default function useIntlMap(items, messageMapper, intl) {
  return useMemo(() => {
    // if messageMapper is not set just original items array
    // in this case items should already contain value prop for each key
    if (!messageMapper) {
      return items
    }
    return items.map(({ key, value }) => {
      let msg = value || key
      try {
        msg = intl.formatMessage({ ...messageMapper(key) })
        return { key, value: msg }
      } catch (e) {
        return { key, value: msg }
      }
    })
  }, [items, messageMapper, intl])
}
