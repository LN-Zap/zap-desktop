import 'jest-styled-components'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

// Import the preload script in order to ensure that global helpers get injected.
import '@zap/electron/preload'

configure({ adapter: new Adapter() })

jest.setTimeout(25000)

jest.mock('workers', () => ({
  neutrinoService: jest.fn(),
  grpcService: jest.fn(),
}))

jest.mock('dns')
