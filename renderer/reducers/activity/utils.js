export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

/**
 * returnTimestamp - Returns invoice, payment or transaction timestamp.
 *
 * @param  {object} activity Activity item
 * @returns {string} Timestamp
 */
export const returnTimestamp = activity => {
  switch (activity.type) {
    case 'transaction':
      return activity.time_stamp
    case 'invoice':
      return activity.settled ? activity.settle_date : activity.creation_date
    case 'payment':
      return activity.creation_date
    default:
      return null
  }
}

/**
 * addDate - Decorates activity entry with date and timestamp fields.
 *
 * @param {object} entry Activity entry
 * @returns {object} decorated activity entry
 */
export const addDate = entry => {
  const timestamp = returnTimestamp(entry)
  const d = new Date(timestamp * 1000)
  const date = d.getDate()
  return { ...entry, date: `${months[d.getMonth()]} ${date}, ${d.getFullYear()}`, timestamp }
}

/**
 * propMatches - Check whether a prop exists and contains a given search string.
 *
 * @param  {string}  prop Prop name
 * @returns {boolean} Boolean indicating if the prop was found and contains the search string
 */
export const propMatches = function propMatches(prop) {
  const { item, searchTextSelector = '' } = this
  return item[prop] && item[prop].toLowerCase().includes(searchTextSelector.toLowerCase())
}

/**
 * groupAll - Sorts data by date and inserts grouping titles.
 *
 * @param {Array} data Items to group
 * @returns {Array} Groups items
 */
export function groupActivity(data) {
  // according too https://stackoverflow.com/a/11252167/3509860
  // this provides an accurate measurement including handling of DST
  const daysBetween = (t1, t2) => Math.round((t2 - t1) / 86400)
  return data
    .sort((a, b) => b.timestamp - a.timestamp)
    .reduce((acc, next) => {
      const prev = acc[acc.length - 1]
      // check if need insert a group title
      if (prev) {
        const days = daysBetween(next.timestamp, prev.timestamp)
        if (days >= 1) {
          acc.push({ title: next.date })
        }
      } else {
        // This is a very first row. Insert title here too
        acc.push({ title: next.date })
      }
      acc.push(next)
      return acc
    }, [])
}

/**
 * applySearch - Filter activity list by checking various properties against a given search string.
 *
 * @param  {Array}  data Activity item list
 * @param  {string} searchTextSelector Search text
 * @returns {Array}  Filtered activity list
 */
export const applySearch = (data, searchTextSelector) => {
  if (!searchTextSelector) {
    return data
  }

  return data.filter(item => {
    // Check basic props for a match.
    const hasPropMatch = [
      'date',
      'type',
      'memo',
      'tx_hash',
      'payment_hash',
      'payment_preimage',
      'payment_request',
      'dest_node_pubkey',
      'dest_node_alias',
    ].some(propMatches, { item, searchTextSelector })

    // Check every destination address.
    const hasAddressMatch =
      item.dest_addresses && item.dest_addresses.find(addr => addr.includes(searchTextSelector))

    // Include the item if at least one search criteria matches.
    return hasPropMatch || hasAddressMatch
  })
}

/**
 * prepareData - Filter dataset with search criteria.
 *
 * @param  {Array}  data Activity item list
 * @param  {string} searchText Search text
 * @returns {Array} Filtered dataset
 */
export const prepareData = (data, searchText) => {
  return groupActivity(applySearch(data, searchText))
}
