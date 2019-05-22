/**
 * getDbName - Derive database name from global config.
 *
 * @param  {*} options Options
 * @returns {string} Database name
 */
const getDbName = options => {
  const { namespace, domain, environment = 'development' } = options
  return [namespace, domain, environment].filter(item => Boolean(item)).join('.')
}

export default getDbName
