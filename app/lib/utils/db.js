export const getDbName = options => {
  const { namespace, domain, environment = 'development' } = options
  return [namespace, domain, environment].filter(item => Boolean(item)).join('.')
}
