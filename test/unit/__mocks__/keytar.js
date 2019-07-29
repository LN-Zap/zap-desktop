import get from 'lodash/get'
import set from 'lodash/set'

const db = {}

module.exports = {
  setPassword(service, account, password) {
    set(db, [service, account], password)
    return Promise.resolve()
  },

  getPassword(service, account) {
    return Promise.resolve(get(db, [service, account], null))
  },

  deletePassword(service, account) {
    set(db, [service, account], null)
    return Promise.resolve()
  },
}
