import React from 'react'
import { storiesOf } from '@storybook/react'
import { Box, Flex } from 'rebass'
import AngleDown from 'components/Icon/AngleDown'
import AngleLeft from 'components/Icon/AngleLeft'
import AngleRight from 'components/Icon/AngleRight'
import AngleUp from 'components/Icon/AngleUp'
import ArrowDown from 'components/Icon/ArrowDown'
import ArrowLeft from 'components/Icon/ArrowLeft'
import ArrowRight from 'components/Icon/ArrowRight'
import ArrowUp from 'components/Icon/ArrowUp'
import Autopay from 'components/Icon/Autopay'
import AutopayCheck from 'components/Icon/AutopayCheck'
import BackupLocal from 'components/Icon/BackupLocal'
import BigArrowRight from 'components/Icon/BigArrowRight'
import Bitcoin from 'components/Icon/Bitcoin'
import BoltOnboarding from 'components/Icon/BoltOnboarding'
import Btcpay from 'components/Icon/Btcpay'
import ChainLink from 'components/Icon/ChainLink'
import Channels from 'components/Icon/Channels'
import Check from 'components/Icon/Check'
import CheckCircle from 'components/Icon/CheckCircle'
import Circle from 'components/Icon/Circle'
import Clock from 'components/Icon/Clock'
import Close from 'components/Icon/Close'
import CloudLightning from 'components/Icon/CloudLightning'
import Cloudbolt from 'components/Icon/Cloudbolt'
import ConnectOnboarding from 'components/Icon/ConnectOnboarding'
import Contacts from 'components/Icon/Contacts'
import Copy from 'components/Icon/Copy'
import Delete from 'components/Icon/Delete'
import Download from 'components/Icon/Download'
import Dropbox from 'components/Icon/Dropbox'
import Error from 'components/Icon/Error'
import ExternalLink from 'components/Icon/ExternalLink'
import Eye from 'components/Icon/Eye'
import EyeOff from 'components/Icon/EyeOff'
import FolderOpen from 'components/Icon/FolderOpen'
import Globe from 'components/Icon/Globe'
import GoogleDrive from 'components/Icon/GoogleDrive'
import Help from 'components/Icon/Help'
import Help2 from 'components/Icon/Help2'
import IconPlus from 'components/Icon/IconPlus'
import ImportOnboarding from 'components/Icon/ImportOnboarding'
import LayoutCards from 'components/Icon/LayoutCards'
import LayoutList from 'components/Icon/LayoutList'
import Lightning from 'components/Icon/Lightning'
import LightningChannel from 'components/Icon/LightningChannel'
import Litecoin from 'components/Icon/Litecoin'
import LndLogo from 'components/Icon/LndLogo'
import Logout from 'components/Icon/Logout'
import LtcLogo from 'components/Icon/LtcLogo'
import Network from 'components/Icon/Network'
import Onchain from 'components/Icon/Onchain'
import Orbit from 'components/Icon/Orbit'
import Padlock from 'components/Icon/Padlock'
import Peers from 'components/Icon/Peers'
import Plus from 'components/Icon/Plus'
import PlusCircle from 'components/Icon/PlusCircle'
import PlusOnboarding from 'components/Icon/PlusOnboarding'
import Qrcode from 'components/Icon/Qrcode'
import Receive from 'components/Icon/Receive'
import Refresh from 'components/Icon/Refresh'
import Search from 'components/Icon/Search'
import Send from 'components/Icon/Send'
import Settings from 'components/Icon/Settings'
import Spinner from 'components/Icon/Spinner'
import Success from 'components/Icon/Success'
import Sync from 'components/Icon/Sync'
import User from 'components/Icon/User'
import Wallet from 'components/Icon/Wallet'
import Wallet2 from 'components/Icon/Wallet2'
import Warning from 'components/Icon/Warning'
import X from 'components/Icon/X'
import Zap from 'components/Icon/Zap'
import ZapLogo from 'components/Icon/ZapLogo'
import ZapLogoBolt from 'components/Icon/ZapLogoBolt'
import ZapSolid from 'components/Icon/ZapSolid'

const iconSizes = [16, 32, 64, 128]
const zapIconsList = {
  AngleDown,
  AngleLeft,
  AngleRight,
  AngleUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Autopay,
  AutopayCheck,
  BackupLocal,
  BigArrowRight,
  Bitcoin,
  BoltOnboarding,
  Btcpay,
  ChainLink,
  Channels,
  Check,
  CheckCircle,
  Circle,
  Clock,
  Close,
  CloudLightning,
  Cloudbolt,
  ConnectOnboarding,
  Contacts,
  Copy,
  Delete,
  Download,
  Dropbox,
  Error,
  ExternalLink,
  Eye,
  EyeOff,
  FolderOpen,
  Globe,
  GoogleDrive,
  Help,
  Help2,
  IconPlus,
  ImportOnboarding,
  LayoutCards,
  LayoutList,
  Lightning,
  LightningChannel,
  Litecoin,
  LndLogo,
  Logout,
  LtcLogo,
  Network,
  Onchain,
  Orbit,
  Padlock,
  Peers,
  Plus,
  PlusCircle,
  PlusOnboarding,
  Qrcode,
  Receive,
  Refresh,
  Search,
  Send,
  Settings,
  Spinner,
  Success,
  Sync,
  User,
  Wallet,
  Wallet2,
  Warning,
  X,
  Zap,
  ZapLogo,
  ZapLogoBolt,
  ZapSolid,
}
const zapIconStories = storiesOf('Icons', module)
Object.keys(zapIconsList).forEach(name => {
  var Icon = zapIconsList[name]
  zapIconStories.add(name, () => (
    <React.Fragment>
      {iconSizes.map(size => (
        <Flex key={`${name}-${size}`} alignItems="center" mb={3}>
          <Box mr={2}>
            {size} x {size}:
          </Box>
          <Icon height={size} width={size} />
        </Flex>
      ))}
    </React.Fragment>
  ))
})
