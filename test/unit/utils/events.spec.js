import { defineEvents } from '@zap/utils/events'

describe('eventDefinition util', () => {
  it('Correctly builds key paths', async () => {
    const events = defineEvents({
      order: {
        list: {
          data: 'data',
          error: 'error',
        },
      },
    })

    expect(events.order.list.data).toEqual('order.list.data')
    // Get interim path.
    expect(events.order.list.getPath()).toEqual('order.list')
    // Check the second time to ensure proxy resets the inner state correctly.
    expect(events.order.list.data).toEqual('order.list.data')
  })

  it('Throws an error for non-existent and non leaf paths', async () => {
    const events = defineEvents({
      order: {
        list: {
          data: 'data',
          error: 'error',
          end: 'end',
        },

        post: {
          data: 'data',
        },
      },
    })

    expect(() => events.order.post.error).toThrow()
    // Check the second time to ensure proxy resets the inner state correctly.
    expect(() => events.order.post.error).toThrow()
    expect(() => `${events.order.post}`).toThrow()
    expect(events.order.list.end).toEqual('order.list.end')
    expect(`${events.order.list.end}`).toEqual('order.list.end')
  })

  it('Tests reach statefullness™ is handled correctly', async () => {
    const events = defineEvents({
      order: {
        list: {
          data: 'data',
          error: 'error',
          end: 'end',
        },

        post: {
          data: 'data',
        },
      },
    })

    // Assignment with event definitions is considered a bad practice and should
    // be discouraged.
    const a = events.order.post
    // eslint-disable-next-line unused-imports/no-unused-vars
    const b = events.order
    expect(() => events.order.list.end).toThrow()
    expect(() => events.order.post.error).toThrow()
    expect(() => a.error).toThrow()
  })
})
