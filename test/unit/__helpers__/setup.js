import 'jest-styled-components'
import snapshotDiff from 'snapshot-diff'
import axios from 'axios'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

jest.setTimeout(25000)

jest.mock('workers', () => ({
  neutrino: jest.fn(),
  grpc: jest.fn(),
}))

jest.mock('dns')

// Configure snapshotDiff with custom serializer.
expect.addSnapshotSerializer(snapshotDiff.getSnapshotDiffSerializer())

// Use NodeJS's HTTP adapter instead of JSDOM's XMLHttpRequests to prevent localhost cross-origin problems.
axios.defaults.adapter = require('axios/lib/adapters/http')
