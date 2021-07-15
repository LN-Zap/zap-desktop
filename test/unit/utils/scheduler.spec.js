import delay from '@zap/utils/delay'
import promiseTimeout from '@zap/utils/promiseTimeout'
import createScheduler from '@zap/utils/scheduler'

describe('createScheduler tasks management', () => {
  it('add task by task callback', () => {
    const scheduler = createScheduler()
    const task = () => {}
    scheduler.addTask({ task })
    expect(scheduler.isScheduled(task)).toEqual(true)
  })

  it('finds by task callback', () => {
    const scheduler = createScheduler()
    const task = () => {}
    const task2 = () => {}
    scheduler.addTask({ task })
    expect(scheduler.isScheduled(task2)).toEqual(false)
    expect(scheduler.isScheduled(task)).toEqual(true)
  })

  it('finds by task id', () => {
    const scheduler = createScheduler()
    const task = () => {}
    scheduler.addTask({ task, taskId: 'task' })
    expect(scheduler.isScheduled('task2')).toEqual(false)
    expect(scheduler.isScheduled('task')).toEqual(true)
  })

  it('add task by taskId', () => {
    const scheduler = createScheduler()
    const task = () => {}
    scheduler.addTask({ task, taskId: 'taskId' })
    expect(scheduler.isScheduled('taskId')).toEqual(true)
  })

  it('remove task by task callback', () => {
    const scheduler = createScheduler()
    const task = () => {}
    scheduler.addTask({ task })
    scheduler.removeTask(task)
    expect(scheduler.isScheduled(task)).toEqual(false)
  })

  it('remove task by taskId', () => {
    const scheduler = createScheduler()
    const task = () => {}
    scheduler.addTask({ task, taskId: 'taskId' })
    scheduler.removeTask('taskId')
    expect(scheduler.isScheduled('taskId')).toEqual(false)
  })

  it('correctly remove all tasks', () => {
    const scheduler = createScheduler()
    const task = () => {}
    scheduler.addTask({ task })
    scheduler.removeAllTasks()
    expect(scheduler.isScheduled(task)).toEqual(false)
  })

  it('correctly replace task ', () => {
    const scheduler = createScheduler()
    const task1 = () => {}
    const task2 = () => {}
    scheduler.addTask({ task: task1, taskId: 'myTask' })
    scheduler.addTask({ task: task2, taskId: 'myTask' })
    expect([scheduler.isScheduled(task1), scheduler.isScheduled(task2)]).toEqual([false, true])
  })
})

describe('createScheduler tasks execution', () => {
  test(`doesn't execute before delay`, () => {
    const scheduler = createScheduler()
    const promise = new Promise((resolve, reject) => {
      scheduler.addTask({ task: reject, taskId: 'taskId', baseDelay: 100 })
    })
    return expect(Promise.race([delay(50), promise])).resolves.toBe(undefined)
  })

  test('executes at least 3 times', () => {
    const scheduler = createScheduler()

    // resolves after 3+ executions
    const promise = new Promise(resolve => {
      let times = 0
      const task = () => {
        times += 1
        if (times) {
          resolve(true)
        }
      }
      scheduler.addTask({ task, taskId: 'taskId', baseDelay: 100 })
    })
    return expect(promiseTimeout(1000, promise)).resolves.toBe(true)
  })

  test('executes at least 3 times with backoff', () => {
    const scheduler = createScheduler()

    // resolves after 3+ executions
    const promise = new Promise(resolve => {
      let times = 0
      const task = () => {
        times += 1
        if (times > 3) {
          resolve(true)
        }
      }
      scheduler.addTask({ task, taskId: 'taskId', baseDelay: 100, backoff: 1.1 })
    })
    return expect(promiseTimeout(1000, promise)).resolves.toBe(true)
  })

  test('cancels execution correctly', () => {
    const scheduler = createScheduler()

    const promise = new Promise((resolve, reject) => {
      scheduler.addTask({ task: reject, taskId: 'taskId', baseDelay: 100 })
      // make sure remove is executed during the next event loop iteration
      // to make test more robust
      setTimeout(() => scheduler.removeTask('taskId'), 0)
    })
    return expect(Promise.race([delay(200), promise])).resolves.toBe(undefined)
  })

  test('cancels execution of the replaced callback correctly', () => {
    const scheduler = createScheduler()

    const originalTask = new Promise((resolve, reject) => {
      scheduler.addTask({ task: reject, taskId: 'taskId', baseDelay: 10 })
    })

    const replacedTask = new Promise(resolve => {
      scheduler.addTask({ task: resolve, taskId: 'taskId', baseDelay: 100 })
    })

    const promise = Promise.race([originalTask, replacedTask])
    return expect(promiseTimeout(200, promise)).resolves.toBe(undefined)
  })

  test('cancels all tasks correctly', () => {
    const scheduler = createScheduler()

    const originalTask = new Promise((resolve, reject) => {
      scheduler.addTask({ task: reject, baseDelay: 10 })
    })

    scheduler.removeAllTasks()

    const replacedTask = new Promise(resolve => {
      scheduler.addTask({ task: resolve, baseDelay: 100 })
    })

    const promise = Promise.race([originalTask, replacedTask])
    return expect(promiseTimeout(200, promise)).resolves.toBe(undefined)
  })

  test('handles runImmediately correctly', () => {
    const scheduler = createScheduler()

    const promise = new Promise(resolve => {
      scheduler.addTask({ task: () => resolve(true), baseDelay: 10, runImmediately: true })
    })

    scheduler.removeAllTasks()

    return expect(promiseTimeout(5, promise)).resolves.toBe(true)
  })
})
