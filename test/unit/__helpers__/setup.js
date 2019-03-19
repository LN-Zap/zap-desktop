import 'jest-styled-components'

import { configure } from 'enzyme'
import config from 'config'

import Adapter from 'enzyme-adapter-react-16'

global.CONFIG = config

configure({ adapter: new Adapter() })

jest.setTimeout(25000)
