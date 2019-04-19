import config from 'config'
import debugLogger from 'debug-logger'

// Enable colours for object inspection.
debugLogger.inspectOptions = {
  colors: true,
}

// Enable all zap logs if DEBUG has not been explicitly set.
if (!process.env.DEBUG) {
  process.env.DEBUG = config.debug
}
if (!process.env.DEBUG_LEVEL) {
  process.env.DEBUG_LEVEL = config.debugLevel
}

// Method to configure a logger instance with a specific namespace suffix.
const logConfig = name => ({
  levels: {
    trace: {
      prefix: '[TRC]  ',
      namespaceSuffix: `:${name}`,
      fd: 1,
    },
    debug: {
      prefix: '[DBG]  ',
      namespaceSuffix: `:${name}`,
      fd: 1,
    },
    log: {
      prefix: '[LOG]  ',
      namespaceSuffix: `:${name}`,
      fd: 1,
    },
    info: {
      prefix: '[INF]  ',
      namespaceSuffix: `:${name}`,
      fd: 1,
    },
    warn: {
      prefix: '[WRN]  ',
      namespaceSuffix: `:${name}`,
      color: debugLogger.colors.red,
    },
    error: {
      prefix: '[ERR]  ',
      namespaceSuffix: `:${name}`,
    },
    critical: {
      color: debugLogger.colors.magenta,
      prefix: '[CRT]  ',
      namespaceSuffix: `:${name}`,
      level: 6,
    },
  },
})

// Create logs for use in the app.
export const mainLog = debugLogger.config(logConfig('main'))('zap')
export const lndLog = debugLogger.config(logConfig('lnd'))('zap')
export const updaterLog = debugLogger.config(logConfig('updater'))('zap')
export const grpcLog = debugLogger.config(logConfig('grpc'))('zap')

let lndLogLevel = null // stored most recent log level for continuity
export const lndLogGetLevel = msg => {
  // Define a mapping between log level prefixes and log level names.
  const levelMap = {
    TRC: 'trace',
    DBG: 'debug',
    INF: 'info',
    WRN: 'warn',
    ERR: 'error',
    CRT: 'critical',
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
