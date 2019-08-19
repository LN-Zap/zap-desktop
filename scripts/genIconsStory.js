import { execSync } from 'child_process'
import { readdir, writeFile } from 'fs'
import { promisify } from 'util'

const fsReaddir = promisify(readdir)
const fsWriteFile = promisify(writeFile)

/**
 * getIcons - Get list of available icons.
 *
 * @param {string} inputDir directory to look for icons in
 * @returns {Array<string>} array of icon names without extensions
 */
async function getIcons(inputDir) {
  const files = await fsReaddir(inputDir)
  return files
    .reduce((acc, next) => {
      const [fileName, ext] = next.split('.')
      if (ext === 'js') {
        acc.push(fileName)
      }
      return acc
    }, [])
    .sort()
}

const createIconStory = (iconBasePath, icons) => {
  const unwrapIconImports = () => {
    return icons.reduce((acc, next) => {
      return `${acc}import ${next} from '${iconBasePath}${next}'\n`
    }, '')
  }

  const unwrapIconList = () => {
    const iconList = icons.reduce((acc, next) => `${acc}${next},\n`, '')
    return `const zapIconsList = {${iconList}}`
  }

  return `import React from 'react'
import { storiesOf } from '@storybook/react'
import { Box, Flex } from 'rebass'
${unwrapIconImports()}
const iconSizes = [16, 32, 64, 128]
${unwrapIconList()}
const zapIconStories = storiesOf('Icons', module)
Object.keys(zapIconsList).forEach(name => {
  var Icon = zapIconsList[name]
  zapIconStories.add(name, () => (
    <React.Fragment>
      {iconSizes.map(size => (
        <Flex key={\`\${name}-\${size}\`} alignItems="center" mb={3}>
          <Box mr={2}>
            {size} x {size}:
          </Box>
          <Icon height={size} width={size} />
        </Flex>
      ))}
    </React.Fragment>
  ))
})`
}

/**
 * updateStorybook - Updates storybook icons section at `outputFile` with all the icons available in `inputDir`.
 *
 * @param {string} inputDir directory to look for icons in
 * @param {string} iconImportPath base import path form the icons e.g 'components/Icon/'
 * @param {string} outputFile output storybook file path
 */
export default async function updateStorybook(inputDir, iconImportPath, outputFile) {
  const story = createIconStory(iconImportPath, await getIcons(inputDir))
  await fsWriteFile(outputFile, story)
  execSync(`npm run lint-fix-base -- "${outputFile}"`, { stdio: [0, 1, 2] })
}
