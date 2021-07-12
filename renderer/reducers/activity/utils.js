import { mainLog } from '@zap/utils/log'
import combinePaginators from '@zap/utils/pagination'
import { grpc } from 'workers'

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
 * @param {object} activity Activity item
 * @returns {number} Timestamp
 */
export const returnTimestamp = activity => {
  switch (activity.type) {
    case 'transaction':
      return activity.timeStamp
    case 'invoice':
      return activity.isSettled ? activity.settleDate : activity.creationDate
    case 'payment':
      return activity.creationDate
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
 * @param {string}  prop Prop name
 * @returns {boolean} Boolean indicating if the prop was found and contains the search string
 */
export const propMatches = function propMatches(prop) {
  const { item, searchTextSelector = '' } = this
  return item[prop] && item[prop].toLowerCase().includes(searchTextSelector.toLowerCase())
}

/**
 * groupAll - Sorts data by date and inserts grouping titles.
 *
 * @param {any[]} data Items to group
 * @returns {any[]} Grouped items
 */
export function groupActivity(data) {
  return data
    .sort((a, b) => b.timestamp - a.timestamp)
    .reduce((acc, next) => {
      const prev = acc[acc.length - 1]
      // check if need insert a group title
      if (prev) {
        if (prev.date !== next.date) {
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
 * @param {any[]}  data Activity item list
 * @param {string} searchTextSelector Search text
 * @returns {any[]}  Filtered activity list
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
      'txHash',
      'paymentHash',
      'paymentPreimage',
      'paymentRequest',
      'destNodePubkey',
      'destNodeAlias',
    ].some(propMatches, { item, searchTextSelector })

    // Check every destination address.
    const hasAddressMatch =
      item.destAddresses && item.destAddresses.find(addr => addr.includes(searchTextSelector))

    // Include the item if at least one search criteria matches.
    return hasPropMatch || hasAddressMatch
  })
}

/**
 * prepareData - Filter dataset with search criteria.
 *
 * @param {any[]}  data Activity item list
 * @param {string} searchText Search text
 * @returns {any[]} Filtered dataset
 */
export const prepareData = (data, searchText) => {
  return groupActivity(applySearch(data, searchText))
}

/**
 * createActivityPaginator - Creates activity paginator object.
 *
 * @param {object} options Options.
 * @param {Function} options.invoiceHandler Invoice handler. Called when new invoices are fetched.
 * @param {Function} options.paymentHandler Payment handler. Called when new payments are fetched.
 * @param {Function} options.transactionHandler Transaction handler. Called when new transactions are fetched.
 * @returns {Function} Paginator
 */
export const createActivityPaginator = ({ invoiceHandler, paymentHandler, transactionHandler }) => {
  const fetchInvoices = async (pageSize, offset) => {
    const { invoices, firstIndexOffset } = await grpc.services.Lightning.listInvoices({
      numMaxInvoices: pageSize,
      indexOffset: offset,
      reversed: true,
    })
    invoiceHandler(invoices)
    return { items: invoices, offset: parseInt(firstIndexOffset || 0, 10) }
  }

  const fetchPayments = async (pageSize, offset) => {
    const { payments, firstIndexOffset } = await grpc.services.Lightning.listPayments({
      maxPayments: pageSize,
      indexOffset: offset,
      reversed: true,
    })
    paymentHandler(payments)
    return { items: payments, offset: parseInt(firstIndexOffset || 0, 10) }
  }

  const fetchTransactions = async (pageSize, offset, blockHeight) => {
    // Lets load 10x more bloks than page size is set to since blocks only cover a 10 minute period.
    // with a 250 item page size, that would mean loading transactions in chunks of about 20 days.
    const vPageSize = pageSize * 10
    const firstStart = blockHeight - vPageSize

    // Determine end height.
    let endHeight = offset || -1

    // Determine start point.
    let startHeight = offset === 0 ? firstStart : offset - vPageSize

    let count = 0
    let items = []

    let hasMoreItems = startHeight > 500000 && count < pageSize

    /* eslint-disable no-await-in-loop */
    while (hasMoreItems) {
      // Load items.
      mainLog.info(`Loading transactions from block height ${startHeight} to ${endHeight}`)
      const { transactions } = await grpc.services.Lightning.getTransactions({
        startHeight,
        endHeight,
      })
      mainLog.info(
        `Loaded ${transactions.length} transactions from block height ${startHeight} to ${endHeight}`
      )
      transactionHandler(transactions)

      count += transactions.length
      items = items.concat(transactions)

      // Lightning didn't exist prior to this so no point in going back further.
      // TOOO: Figure out the wallet birthday and stop at that point.
      hasMoreItems = startHeight > 500000 && count < pageSize
      if (hasMoreItems) {
        // Determine next end height.
        endHeight = startHeight

        // Determine next start point.
        startHeight = endHeight - vPageSize
      }
    }
    mainLog.info(`Loaded ${items.length} transactions in total for paginator`)
    return { items, offset: startHeight }
  }

  const getTimestamp = item =>
    parseInt(item.timeStamp, 10) || parseInt(item.settleDate, 10) || parseInt(item.creationDate, 10)

  const itemSorter = (a, b) => getTimestamp(b) - getTimestamp(a)

  return combinePaginators(itemSorter, fetchInvoices, fetchPayments, fetchTransactions)
}

/**
 * getItemType - Determine an activity item type.
 *
 * @param {object} item Activity item
 * @returns {string} Item type
 */
export const getItemType = item => {
  if (item.destAddresses) {
    return 'transactions'
  }
  if ('addIndex' in item) {
    return 'invoices'
  }
  return 'payments'
}
