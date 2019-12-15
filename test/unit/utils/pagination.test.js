import combinePaginators from '@zap/utils/pagination'

/**
 * createSamplePaginator - Creates paginator from data.
 *
 * @param {Array} items data
 * @returns {Function} Paginator function
 */
function createSamplePaginator(items) {
  return async (pageSize, offset) => {
    return {
      items: items.slice(offset, Math.min(items.length, offset + pageSize)),
      offset: offset + pageSize >= items.length ? 0 : offset + pageSize,
    }
  }
}

/**
 * paginator1 - Pagiantor1.
 *
 * @returns {Function} Paginator function
 */
function paginator1() {
  return createSamplePaginator([
    { data: 1, timestamp: 1569840844 },
    { data: 2, timestamp: 1569840744 },
    { data: 3, timestamp: 1569840644 },
    { data: 4, timestamp: 1569840544 },
    { data: 5, timestamp: 1569840444 },
    { data: 6, timestamp: 1569840344 },
    { data: 7, timestamp: 1569840244 },
    { data: 8, timestamp: 1569840144 },
  ])
}

/**
 * paginator2 - Pagiantor2.
 *
 * @returns {Function} Paginator function
 */
function paginator2() {
  return createSamplePaginator([
    { data: 21, timestamp: 1569841044 },
    { data: 22, timestamp: 1569840944 },
    { data: 23, timestamp: 1569840644 },
    { data: 24, timestamp: 1569840544 },
    { data: 25, timestamp: 1569840444 },
    { data: 26, timestamp: 1569840344 },
    { data: 27, timestamp: 1569840245 },
    { data: 28, timestamp: 1569840144 },
  ])
}

/**
 * paginator3 - Pagiantor3.
 *
 * @returns {Function} Paginator function
 */
function paginator3() {
  return createSamplePaginator([
    { data: 31, timestamp: 1559841044 },
    { data: 32, timestamp: 1559840944 },
    { data: 33, timestamp: 1559840644 },
    { data: 34, timestamp: 1559840544 },
    { data: 35, timestamp: 1559840444 },
  ])
}

/**
 * paginator4 - Pagiantor4.
 *
 * @returns {Function} Paginator function
 */
function paginator4() {
  return createSamplePaginator([
    { data: 0, timestamp: 1579840844 },
    { data: 1, timestamp: 1579840843 },
    { data: 2, timestamp: 1579840842 },
    { data: 3, timestamp: 1579840841 },
    { data: 4, timestamp: 1579840840 },
    { data: 5, timestamp: 1579840839 },
    { data: 6, timestamp: 1579840838 },
    { data: 7, timestamp: 1579840837 },
    { data: 8, timestamp: 1579840836 },
    { data: 9, timestamp: 1579840835 },
    { data: 10, timestamp: 1579840834 },
    { data: 11, timestamp: 1579840833 },
    { data: 12, timestamp: 1579840832 },
    { data: 13, timestamp: 1579840831 },
    { data: 14, timestamp: 1579840830 },
    { data: 15, timestamp: 1579840829 },
    { data: 16, timestamp: 1579840828 },
    { data: 17, timestamp: 1579840827 },
    { data: 18, timestamp: 1579840826 },
    { data: 19, timestamp: 1579840825 },
    { data: 20, timestamp: 1579840824 },
    { data: 21, timestamp: 1579840823 },
    { data: 22, timestamp: 1579840822 },
  ])
}

/**
 * paginator5 - Pagiantor5.
 *
 * @returns {Function} Paginator function
 */
function paginator5() {
  return createSamplePaginator([
    { data: 51, timestamp: 1459841044 },
    { data: 52, timestamp: 1459840944 },
    { data: 53, timestamp: 1459840644 },
    { data: 54, timestamp: 1459840544 },
    { data: 55, timestamp: 1459840444 },
  ])
}

describe('sample paginator', () => {
  test(`tests sample paginator`, async () => {
    const paginator = paginator1()
    const { items, offset } = await paginator(2, 0)
    expect(items).toEqual([
      { data: 1, timestamp: 1569840844 },
      { data: 2, timestamp: 1569840744 },
    ])

    expect((await paginator(3, offset)).items).toEqual([
      { data: 3, timestamp: 1569840644 },
      { data: 4, timestamp: 1569840544 },
      { data: 5, timestamp: 1569840444 },
    ])
  })
})

describe('basic pagination', () => {
  test(`basic combined pagination`, async () => {
    const paginator = combinePaginators((a, b) => b.timestamp - a.timestamp, paginator1())
    const { items } = await paginator(2)
    expect(items).toEqual([
      { data: 1, timestamp: 1569840844 },
      { data: 2, timestamp: 1569840744 },
    ])
  })
})

describe('combined multiple paginators', () => {
  test(`multiple paginators + multiple queries`, async () => {
    const paginator = combinePaginators(
      (a, b) => b.timestamp - a.timestamp,
      paginator1(),
      paginator2(),
      paginator3()
    )
    const { items, hasNextPage } = await paginator(10)
    expect(items).toEqual([
      { data: 21, timestamp: 1569841044 },
      { data: 22, timestamp: 1569840944 },
      { data: 1, timestamp: 1569840844 },
      { data: 2, timestamp: 1569840744 },
      { data: 3, timestamp: 1569840644 },
      { data: 23, timestamp: 1569840644 },
      { data: 4, timestamp: 1569840544 },
      { data: 24, timestamp: 1569840544 },
      { data: 5, timestamp: 1569840444 },
      { data: 25, timestamp: 1569840444 },
    ])
    expect(hasNextPage).toBe(true)

    const { items: items2 } = await paginator(9)
    expect(items2).toEqual([
      { data: 6, timestamp: 1569840344 },
      { data: 26, timestamp: 1569840344 },
      { data: 27, timestamp: 1569840245 },
      { data: 7, timestamp: 1569840244 },
      { data: 8, timestamp: 1569840144 },
      { data: 28, timestamp: 1569840144 },
      { data: 31, timestamp: 1559841044 },
      { data: 32, timestamp: 1559840944 },
      { data: 33, timestamp: 1559840644 },
    ])

    expect(await paginator(19)).toEqual({
      hasNextPage: false,
      items: [
        { data: 34, timestamp: 1559840544 },
        { data: 35, timestamp: 1559840444 },
      ],
    })
  })

  test(`returns entire dataset from multiple paginators`, async () => {
    const paginator = combinePaginators(
      (a, b) => b.timestamp - a.timestamp,
      paginator1(),
      paginator2(),
      paginator3()
    )
    const { items, hasNextPage } = await paginator(100)
    expect(hasNextPage).toBe(false)
    expect(items).toEqual(
      [
        ...(await paginator1()(100, 0)).items,
        ...(await paginator2()(100, 0)).items,
        ...(await paginator3()(100, 0)).items,
      ].sort((a, b) => b.timestamp - a.timestamp)
    )
  })

  test(`correctly manages internal cache`, async () => {
    const paginator = combinePaginators(
      (a, b) => b.timestamp - a.timestamp,
      paginator1(),
      paginator2(),
      paginator3(),
      paginator5(),
      paginator4()
    )
    const yieldItems = async pageSize => (await paginator(pageSize, 0)).items
    const { items, hasNextPage } = await paginator(4)
    expect(hasNextPage).toBe(true)
    expect(items).toEqual([
      { data: 0, timestamp: 1579840844 },
      { data: 1, timestamp: 1579840843 },
      { data: 2, timestamp: 1579840842 },
      { data: 3, timestamp: 1579840841 },
    ])

    expect(await yieldItems(4)).toEqual([
      { data: 4, timestamp: 1579840840 },
      { data: 5, timestamp: 1579840839 },
      { data: 6, timestamp: 1579840838 },
      { data: 7, timestamp: 1579840837 },
    ])

    expect(await yieldItems(5)).toEqual([
      { data: 8, timestamp: 1579840836 },
      { data: 9, timestamp: 1579840835 },
      { data: 10, timestamp: 1579840834 },
      { data: 11, timestamp: 1579840833 },
      { data: 12, timestamp: 1579840832 },
    ])

    expect(await yieldItems(12)).toEqual([
      { data: 13, timestamp: 1579840831 },
      { data: 14, timestamp: 1579840830 },
      { data: 15, timestamp: 1579840829 },
      { data: 16, timestamp: 1579840828 },
      { data: 17, timestamp: 1579840827 },
      { data: 18, timestamp: 1579840826 },
      { data: 19, timestamp: 1579840825 },
      { data: 20, timestamp: 1579840824 },
      { data: 21, timestamp: 1579840823 },
      { data: 22, timestamp: 1579840822 },
      { data: 21, timestamp: 1569841044 },
      { data: 22, timestamp: 1569840944 },
    ])
  })
})
