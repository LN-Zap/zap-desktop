function getPackageDetails() {
  const { productName, version } = require('../../package.json')
  return { productName, version }
}

export default getPackageDetails
