import chainify from '@zap/utils/chainify'
import delay from '@zap/utils/delay'

describe('chainify util', () => {
  it('works with regular functions', async () => {
    const fn = chainify(arg => Promise.resolve(arg))
    const arr = []
    arr.push(fn(0))
    arr.push(fn(1))
    arr.push(fn(2))
    arr.push(fn(3))
    expect(await Promise.all(arr)).toEqual([0, 1, 2, 3])
  })

  it('works with classes', async () => {
    class Counter {
      count = 0

      inc = chainify(async () => {
        const current = this.count
        await delay(10)
        this.count += 1
        return current
      })
    }
    const inst = new Counter()
    const arr = []
    arr.push(inst.inc())
    arr.push(inst.inc())
    arr.push(inst.inc())
    arr.push(inst.inc())
    expect(await Promise.all(arr)).toEqual([0, 1, 2, 3])
  })

  it('blocks subsequent calls from execution until current one is finished', async () => {
    const fn = chainify(arg => {
      return new Promise(resolve => {
        arg < 10 && resolve(arg)
      })
    })
    const arr = []
    arr.push(fn(0))
    arr.push(fn(1))
    arr.push(fn(20)) // block exec
    arr.push(fn(3))
    expect(await Promise.race([delay(50), Promise.all(arr)])).toEqual(undefined)
  })
})
