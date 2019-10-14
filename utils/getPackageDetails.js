import { productName, version } from '../package.json'

/**
 * getPackageDetails - Get package details from package.json.
 *
 * @returns {{productName:string, version:string}} Package details
 */
const getPackageDetails = () => {
  return { productName, version }
}

export default getPackageDetails
