import { ClientFunction } from 'testcafe'

export const getBaseUrl = () => '../../app/dist/index.html'

export const getPageUrl = ClientFunction(() => window.location.href)

export const getPageTitle = ClientFunction(() => document.title)

export const assertNoConsoleErrors = async t => {
  const { error } = await t.getBrowserConsoleMessages()
  await t.expect(error).eql([])
}
