import createDebouncedQueue from '@zap/utils/debouncedFuncQueue'
import delay from '@zap/utils/delay'

describe('debouncedFuncQueue', () => {
  it('correctly enqueues actions', async () => {
    let result
    const action = (...params) => {
      result = params.reduce((acc, next) => acc + next, 0)
    }

    const debounced = createDebouncedQueue(action, 50)
    debounced(1)
    debounced(2)
    debounced(3)
    debounced(4)
    await delay(110)

    expect(result).toEqual(10)
  })

  it('correctly deffer queue unwrap', async () => {
    let result = 0
    const action = (...params) => {
      result = params.reduce((acc, next) => acc + next, 0)
    }

    const debounced = createDebouncedQueue(action, 100)
    debounced(1)
    debounced(2)
    debounced(3)
    debounced(4)
    await delay(10)

    expect(result).toEqual(0)
  })

  it('correctly handles max wait', async () => {
    let result = 0
    const action = (...params) => {
      result = params.reduce((acc, next) => acc + next, 0)
    }

    const debounced = createDebouncedQueue(action, 10, 30)
    debounced(1)
    debounced(2)
    debounced(3)
    await delay(60) // queue must flush at this point
    debounced(4)
    debounced(5)
    debounced(6)
    await delay(20)

    expect(result).toEqual(15)
  })
})
