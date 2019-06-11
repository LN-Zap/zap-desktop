import camelCase from 'lodash/camelCase'

const { execSync } = require('child_process')
const path = require('path')

const OUTPUT_DIR = 'renderer/components/Icon'
const TMP_DIR = 'icon_gen_temp'

const iconPath = process.argv[2] || ''

/**
 * Converts iconPath to pascal case icon name
 *
 * @returns {string}
 */
function getIconName() {
  const [icon] = path.basename(iconPath).split('.')
  const camelCaseName = camelCase(icon)
  const pascalCaseName = camelCaseName[0].toUpperCase() + camelCaseName.slice(1)
  return `${pascalCaseName}.js`
}

try {
  execSync(
    `rm -rf ${TMP_DIR} &&\
     mkdir ${TMP_DIR} &&\
     cp ${iconPath} ${TMP_DIR} &&\
     svgr --icon -d ${OUTPUT_DIR} ${TMP_DIR} &&\
     npm run lint-fix-base -- renderer/components/Icon/${getIconName()}
   `,
    { stdio: [0, 1, 2] }
  )
} finally {
  execSync(`rm -rf ${TMP_DIR}`, { stdio: [0, 1, 2] })
}
