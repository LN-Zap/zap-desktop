import newGithubIssueUrl from 'new-github-issue-url'

/**
 * createZapIssueTemplate - Creates zap issue template.
 *
 * @param {object} options issue options
 * @param {string} options.title issue title
 * @param {string} options.body issue body
 * @param {Array<string>} options.labels list of issue labels
 * @param {string} options.productName zap!
 * @param {string} options.version zap version
 * @returns {string} github issue url
 */
export default function createZapIssueTemplate({ title, body, labels, productName, version }) {
  return newGithubIssueUrl({
    user: 'LN-Zap',
    repo: 'zap-desktop',
    title,
    labels,
    body: `Detailed Description\n-------\n\`\`${body}\`\`
        \nYour Environment\n----\n- Zap version: ${productName} ${version}`,
  })
}
