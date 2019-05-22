/**
 * getPackageDetails - Get package details from package.json.
 *
 * @returns {{productName:string, version:string}} Package details
 */
const getPackageDetails = () => {
  const { productName, version } = require('../package.json')
  return { productName, version }
}

export default getPackageDetails
