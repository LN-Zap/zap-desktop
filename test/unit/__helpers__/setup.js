import 'jest-styled-components'
import snapshotDiff from 'snapshot-diff'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

// Import the preload script in order to ensure that global helpers get injected.
import '@zap/electron/preload'

configure({ adapter: new Adapter() })

jest.setTimeout(25000)

jest.mock('workers', () => ({
  neutrino: jest.fn(),
  grpc: jest.fn(),
}))

jest.mock('dns')

// Configure snapshotDiff with custom serializer.
expect.addSnapshotSerializer(snapshotDiff.getSnapshotDiffSerializer())
