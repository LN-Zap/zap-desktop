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
 * @returns {*} Schedular
 */
export default function createScheduler() {
  const taskList = {}

  /**
   * onCancelComplete - Physically removes `taskDefinition` from the execution queue.
   *
   * @param {string|Function} task - either original callback or `taskId`
   */
  const onCancelComplete = task => {
    const taskDesc = findTask(task)
    if (taskDesc) {
      const keyToRemove = Object.keys(taskList).find(key => taskList[key] === taskDesc)
      if (keyToRemove) {
        delete taskList[keyToRemove]
      }
    }
  }

  /**
   * findTask - Searches for the `taskDefinition` is in the execution queue.
   *
   * @param {string|Function} task - either original callback or `taskId`
   * @returns {*} Task definition
   */
  const findTask = task => {
    // search by taskId first
    const { [task]: taskDesc } = taskList
    if (taskDesc) {
      return taskDesc
    }

    // else try to find by task callback
    return Object.values(taskList).find(entry => entry.task === task)
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

    const checkIsCancelled = () => !isScheduled(taskId || task)
    taskList[taskId || task] = { isCancelled: false, task }
    retry({
      getTask,
      baseDelay,
      maxDelay,
      checkIsCancelled,
      backoff,
      onCancelComplete: () => onCancelComplete(task),
    })
  }

  /**
   * removeTask - Removes `task` from the execution queue.
   *
   * @param {string|Function} task - either original callback or `taskId`
   * @returns {boolean} Boolean indicating wether the task was removed
   */
  const removeTask = task => {
    const taskDesc = findTask(task)
    if (taskDesc) {
      taskDesc.isCancelled = true
      return true
    }
    return false
  }

  /**
   * removeAllTasks - Clears the entire execution queue.
   */
  const removeAllTasks = () => {
    Object.keys(taskList).forEach(removeTask)
  }

  /**
   * isScheduled - Checks whether `task` is in the execution queue.
   *
   * @param {string|Function} task - either original callback or `taskId`
   * @returns {boolean} Boolean indicating wether the task is scheduled
   */
  const isScheduled = task => {
    const taskDesc = findTask(task)
    return Boolean(taskDesc && !taskDesc.isCancelled)
  }

  return {
    addTask,
    removeTask,
    removeAllTasks,
    isScheduled,
  }
}
