import newGithubIssueUrl from 'new-github-issue-url'
import getPackageDetails from '@zap/utils/getPackageDetails'

/**
 * createZapIssueTemplate - Creates zap issue template.
 *
 * @param {string} title issue title
 * @param {string} body issue body
 * @param {Array<string>} labels list of issue labels
 * @returns {string} github issue url
 */
export default function createZapIssueTemplate(title, body, labels) {
  const { productName, version } = getPackageDetails()
  return newGithubIssueUrl({
    user: 'LN-Zap',
    repo: 'zap-desktop',
    title,
    labels,
    body: `Detailed Description\n-------\n\`\`${body}\`\`
        \nYour Environment\n----\n- Zap version: ${productName} ${version}`,
  })
}
