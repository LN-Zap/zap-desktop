import { ReactSelector } from 'testcafe-react-selectors'

class Syncing {
  loadingBolt = ReactSelector('LoadingBolt')
  syncing = ReactSelector('Syncing')
  qrcode = ReactSelector('QRCode')
}

export default Syncing
