export const getDbName = config => {
  const {
    db: { namespace, domain },
  } = config
  const env = process.env.NODE_ENV || 'development'

  return [namespace, domain, env].filter(item => Boolean(item)).join('.')
}
