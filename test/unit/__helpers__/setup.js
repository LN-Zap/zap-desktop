import 'jest-styled-components'

import { configure } from 'enzyme'

import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

jest.setTimeout(25000)

jest.mock('workers', () => ({
  neutrinoService: jest.fn(),
  lightningService: jest.fn(),
  walletUnlockerService: jest.fn(),
}))
