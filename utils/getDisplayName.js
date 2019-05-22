/**
 * getDisplayName - Derive an appropriate component name from a wraped component.
 *
 * @param {*} WrappedComponent Component to get display name for
 * @returns {string} Display name
 */
const getDisplayName = WrappedComponent => {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

export default getDisplayName
