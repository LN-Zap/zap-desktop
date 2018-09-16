import debugLogger from 'debug-logger'

// Enable colours for object inspection.
debugLogger.inspectOptions = {
  colors: true
}

// Enable all zap logs if DEBUG has not been explicitly set.
if (!process.env.DEBUG) {
  // debugLogger.debug.enable('zap:*')
  process.env.DEBUG = 'zap:main,zap:lnd,zap:updater'
}
if (!process.env.DEBUG_LEVEL) {
  process.env.DEBUG_LEVEL = 'info'
}

// Method to configure a logger instance with a specific namespace suffix.
const logConfig = name => ({
  levels: {
    trace: {
      prefix: '[TRC]  ',
      namespaceSuffix: `:${name}`
    },
    debug: {
      prefix: '[DBG]  ',
      namespaceSuffix: `:${name}`
    },
    log: {
      prefix: '[LOG]  ',
      namespaceSuffix: `:${name}`
    },
    info: {
      prefix: '[INF]  ',
      namespaceSuffix: `:${name}`
    },
    warn: {
      prefix: '[WRN]  ',
      namespaceSuffix: `:${name}`
    },
    error: {
      prefix: '[ERR]  ',
      namespaceSuffix: `:${name}`
    },
    critical: {
      color: debugLogger.colors.magenta,
      prefix: '[CRT]  ',
      namespaceSuffix: `:${name}`,
      level: 6,
      fd: 2
    }
  }
})

// Create logs for use in the app.
export const mainLog = debugLogger.config(logConfig('main'))('zap')
export const lndLog = debugLogger.config(logConfig('lnd'))('zap')
export const updaterLog = debugLogger.config(logConfig('updater'))('zap')

let lndLogLevel = null // stored most recent log level for continuity
export const lndLogGetLevel = msg => {
  // Define a mapping between log level prefixes and log level names.
  const levelMap = {
    TRC: 'trace',
    DBG: 'debug',
    INF: 'info',
    WRN: 'warn',
    ERR: 'error',
    CRT: 'critical'
  }

  // Parse the log line to determine its level.
  let level
  Object.entries(levelMap).forEach(([key, value]) => {
    if (msg.includes(`[${key}]`)) {
      level = value
    }
  })
  if (level) {
    lndLogLevel = level
    return level
  }
  // We set the default level to trace.
  // The only log lines that don't include a level prefix are a part of trace entries
  return lndLogLevel || 'trace'
}
