import keytar from 'keytar'

/**
 * createStorage - create a secure storage interface for the specified namespace.
 *
 * @param {string} namespace desired namespace
 * @returns {object} secure storage instance
 */
function createStorage(namespace) {
  const { setPassword, getPassword, deletePassword } = keytar
  const setKey = (key, value) => {
    return setPassword(namespace, key, value)
  }

  const getKey = key => {
    return getPassword(namespace, key)
  }

  const deleteKey = key => {
    return deletePassword(namespace, key)
  }

  return {
    setKey,
    getKey,
    deleteKey,
  }
}

export default createStorage
