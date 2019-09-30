/**
 * combinePaginators - Combines multiple simple paginators into a single stateful paginator.
 *
 * @param {Array<Function>} paginators simple pagination function which accepts offset and is expected
 * to return {items, offset} object.
 * Offset should be used in a subsequent call to obtain next page.
 * If there is no next page available paginator must return 0 as the offset.
 * @returns {Function} Stateful paginator function that accepts `pageSize` parameter and yields
 * next page on each call. Calling paginator function returns an Object which has two fields {items, hasNextPage}
 * items is fetch result and hasNextPage indicates whether more data can be fetched with a subsequent paginator call.
 */
export default function combinePaginators(...paginators) {
  // items that weren't included in the previous result if any
  let cache = []
  // pagination tip fo reach of `paginators`
  const offsets = new Map()

  return async pageSize => {
    // splits `items` into two parts - result and rest based on`pageSize`
    // rest is a leftover which should be merged into cache
    const splitResult = (...items) => {
      const flat = items.flat().sort((a, b) => b.timestamp - a.timestamp)
      const splitPoint = Math.min(pageSize, flat.length)
      return [flat.slice(0, splitPoint), flat.slice(splitPoint)]
    }

    // returns combined array of results from calling all the paginators.next
    const fetchNextPage = async () => {
      // checks whether particular paginator has more to yield
      const hasMore = p => !offsets.has(p) || offsets.get(p)
      const depleted = { offset: 0, items: [] }
      const next = p => p(pageSize, offsets.get(p) || 0)
      return await Promise.all(paginators.map(p => (hasMore(p) ? next(p) : depleted)))
    }

    // returns true if some of the paginators have next page
    const hasNextPage = () => [...offsets.values()].find(Boolean)
    // prepares function result
    const createResult = items => ({ items, hasNextPage: Boolean(cache.length || hasNextPage()) })

    const current = await fetchNextPage()

    // update tip for each paginator
    paginators.forEach((p, index) => {
      const { offset } = current[index]
      offsets.set(p, offset)
    })
    const [result, rest] = splitResult(cache, current.flatMap(({ items }) => items))
    cache = rest
    return createResult(result)
  }
}
