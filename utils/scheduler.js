import delay from './delay'

/**
 * retry - Recursive timeout function.
 *
 * @param {{ task, baseDelay, maxDelay, checkIsCancelled, backoff }} options Options
 * @returns {Promise} Promise
 */
async function retry({
  getTask,
  baseDelay,
  maxDelay,
  checkIsCancelled,
  backoff,
  onCancelComplete,
}) {
  await delay(baseDelay)

  if (checkIsCancelled()) {
    onCancelComplete && onCancelComplete()
  } else {
    try {
      const task = getTask()
      task && task()
    } finally {
      // re-schedule next execution regardless of task result
      const nextDelay = baseDelay * backoff
      retry({
        getTask,
        baseDelay: maxDelay ? Math.min(maxDelay, nextDelay) : nextDelay,
        maxDelay,
        checkIsCancelled,
        backoff,
      })
    }
  }
}

/**
 * createScheduler - Creates scheduler instance. It is allowed to have unlimited scheduler instances.
 *
 * Schedulers allow to add and remove tasks with flat or backoff schedules.
 *
 * @returns {*} Scheduler
 */
export default function createScheduler() {
  const taskList = {}
  const cancelledTasks = {}
  // internal task id generator
  let taskIdGen = 0

  /**
   * onCancelComplete - Physically removes `taskDefinition` from the execution queue.
   *
   * @param {number} internalId - internal task id
   */
  const onCancelComplete = internalId => {
    const taskDesc = findTask(internalId)
    if (taskDesc) {
      const keyToRemove = Object.keys(taskList).find(key => taskList[key] === taskDesc)
      if (keyToRemove) {
        delete taskList[keyToRemove]
      }
    }

    delete cancelledTasks[internalId]
  }

  /**
   * genInternalId - Generates unique task id.
   *
   *  @returns {number} unique task id
   */
  const genInternalId = () => {
    taskIdGen += 1
    return taskIdGen
  }

  /**
   * findTask - Searches for the `taskDefinition` is in the execution queue.
   *
   * @param {string|Function|number} task - either original callback, `taskId` or internal task id
   * @returns {*} Task definition
   */
  const findTask = task => {
    // search by taskId first
    const { [task]: taskDesc } = taskList
    if (taskDesc) {
      return taskDesc
    }

    // else try to find by task callback
    return Object.values(taskList).find(entry => entry.internalId === task || entry.task === task)
  }

  /**
   * isCancelled - Checks whether task is in cancellation queue.
   *
   * @param {number} internalId - internal task id assigned during its creation
   * @returns {boolean} true if task is pending cancellation
   */
  const isCancelled = internalId => {
    return cancelledTasks[internalId]
  }

  /**
   * addTask - Enqueues `task` for the continuous execution.
   *
   * @param {*} taskDefinition task configuration
   * @param {Function} taskDefinition.task task callback
   * @param {string} taskDefinition.taskId unique task identifier. Is required if there is an
   * intention to replace `task`
   * @param {number} taskDefinition.baseDelay base delay in ms
   * @param {number} taskDefinition.backoff delay multiplier. Is multiplies `baseDelay` to
   * produce next iteration delay. Use 1 for constant delay
   * @param {number} taskDefinition.maxDelay maximum delay. Only useful if `@backoff` is set
   */
  const addTask = ({ task, taskId, baseDelay, maxDelay, backoff = 1 }) => {
    const getTask = () => {
      if (!taskId) {
        return task
      }
      const taskDesc = findTask(taskId)
      return taskDesc && taskDesc.task
    }

    // general unique task id so we can keep
    // track of its state even after it's removed from
    // the processing queue
    const internalId = genInternalId()
    // if we are scheduling under the existing `taskId` cancel prev one first
    if (taskId && isScheduled(taskId)) {
      removeTask(taskId)
    }

    const checkIsCancelled = () => isCancelled(internalId) || !isScheduled(taskId || task)

    taskList[taskId || task] = { isCancelled: false, task, internalId }

    retry({
      getTask,
      baseDelay,
      maxDelay,
      checkIsCancelled,
      backoff,
      onCancelComplete: () => onCancelComplete(internalId),
    })
  }

  /**
   * cancelTask - Internal helper that sets `taskDesc` to a cancelled state and adds task to a
   * `cancelledTasks` list.
   *
   *  @param {object} taskDesc  one of `taskList` values
   */
  const cancelTask = taskDesc => {
    taskDesc.isCancelled = true
    cancelledTasks[taskDesc.internalId] = true
  }

  /**
   * removeTask - Removes `task` from the execution queue.
   *
   * @param {string|Function} task - either original callback or `taskId`
   * @returns {boolean} Boolean indicating whether the task was removed
   */
  const removeTask = task => {
    const taskDesc = findTask(task)
    if (taskDesc) {
      cancelTask(taskDesc)
      return true
    }
    return false
  }

  /**
   * removeAllTasks - Clears the entire execution queue.
   */
  const removeAllTasks = () => {
    Object.values(taskList).forEach(cancelTask)
  }

  /**
   * isScheduled - Checks whether `task` is in the execution queue.
   *
   * @param {string|Function} task - either original callback or `taskId`
   * @returns {boolean} Boolean indicating whether the task is scheduled
   */
  const isScheduled = task => {
    const taskDesc = findTask(task)
    return Boolean(taskDesc && !taskDesc.isCancelled)
  }

  return {
    taskList,
    addTask,
    removeTask,
    removeAllTasks,
    isScheduled,
  }
}
