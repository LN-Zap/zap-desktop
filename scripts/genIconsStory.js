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
const unwrapIconImports = (iconBasePath, icons) => {
  return icons.reduce((acc, next) => {
    return `${acc}import ${next} from '${iconBasePath}${next}'\n`
  }, '')
}

const unwrapIconList = icons => {
  const iconList = icons.reduce((acc, next) => `${acc}${next},\n`, '')
  return `const zapIconsList = {${iconList}}`
}

const createIconStory = (iconBasePath, icons) => {
  return `import React from 'react'
import { storiesOf } from '@storybook/react'
import { Box, Flex } from 'rebass'
${unwrapIconImports(iconBasePath, icons)}
const iconSizes = [16, 32, 64, 128]
${unwrapIconList(icons)}
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

const createIconGrid = (iconBasePath, icons) => {
  return `import React from 'react'
import { storiesOf } from '@storybook/react'
import { linkTo } from '@storybook/addon-links'
import { Box, Flex } from 'rebass'
import { Text } from 'components/UI'
${unwrapIconImports(iconBasePath, icons)}
${unwrapIconList(icons)}
storiesOf('General', module).add('Icons', () => (
  <Box
    css={\`
      display: grid;
      grid-template-columns: repeat(auto-fill, 70px);
    \`}
  >
    {Object.keys(zapIconsList).map(name => {
      var Icon = zapIconsList[name]
      return (
        <Flex
          key={name}
          alignItems="center"
          css={\`
            cursor: pointer;
          \`}
          flexDirection="column"
          mb={3}
          onClick={linkTo('Icons', name)}
        >
          <Icon height={32} width={32} />
          <Text color="gray" fontSize="xs" mt={2}>
            {name}
          </Text>
        </Flex>
      )
    })}
  </Box>
))

`
}

/**
 * updateStorybook - Updates storybook icons section at `outputFile` with all the icons available in `inputDir`.
 *
 * @param {string} inputDir directory to look for icons in
 * @param {string} iconImportPath base import path form the icons e.g 'components/Icon/'
 * @param {object} outputFile output storybook file path
 */
export default async function updateStorybook(
  inputDir,
  iconImportPath,
  { allIconsOutput, iconListOutputFile }
) {
  const icons = await getIcons(inputDir)
  const story = createIconStory(iconImportPath, icons)
  await fsWriteFile(iconListOutputFile, story)
  await fsWriteFile(allIconsOutput, createIconGrid(iconImportPath, icons))

  execSync(`npm run lint-fix-base -- "${iconListOutputFile}" "${allIconsOutput}"`, {
    stdio: [0, 1, 2],
  })
}
