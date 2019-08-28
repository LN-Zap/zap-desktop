import React from 'react'
import { storiesOf } from '@storybook/react'
import { linkTo } from '@storybook/addon-links'
import { Box, Flex } from 'rebass'
import { Text } from 'components/UI'
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
import Check from 'components/Icon/Check'
import CheckCircle from 'components/Icon/CheckCircle'
import Circle from 'components/Icon/Circle'
import Clock from 'components/Icon/Clock'
import Close from 'components/Icon/Close'
import CloudLightning from 'components/Icon/CloudLightning'
import ConnectOnboarding from 'components/Icon/ConnectOnboarding'
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
import IconPlus from 'components/Icon/IconPlus'
import ImportOnboarding from 'components/Icon/ImportOnboarding'
import LayoutCards from 'components/Icon/LayoutCards'
import LayoutList from 'components/Icon/LayoutList'
import Lightning from 'components/Icon/Lightning'
import LightningChannel from 'components/Icon/LightningChannel'
import Litecoin from 'components/Icon/Litecoin'
import Logout from 'components/Icon/Logout'
import LtcLogo from 'components/Icon/LtcLogo'
import Network from 'components/Icon/Network'
import Onchain from 'components/Icon/Onchain'
import Padlock from 'components/Icon/Padlock'
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
import Warning from 'components/Icon/Warning'
import X from 'components/Icon/X'
import Zap from 'components/Icon/Zap'
import ZapLogo from 'components/Icon/ZapLogo'
import ZapSolid from 'components/Icon/ZapSolid'

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
  Check,
  CheckCircle,
  Circle,
  Clock,
  Close,
  CloudLightning,
  ConnectOnboarding,
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
  IconPlus,
  ImportOnboarding,
  LayoutCards,
  LayoutList,
  Lightning,
  LightningChannel,
  Litecoin,
  Logout,
  LtcLogo,
  Network,
  Onchain,
  Padlock,
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
  Warning,
  X,
  Zap,
  ZapLogo,
  ZapSolid,
}
storiesOf('General', module).add('Icons', () => (
  <Box
    css={`
      display: grid;
      grid-template-columns: repeat(auto-fill, 70px);
    `}
  >
    {Object.keys(zapIconsList).map(name => {
      var Icon = zapIconsList[name]
      return (
        <Flex
          key={name}
          alignItems="center"
          css={`
            cursor: pointer;
          `}
          flexDirection="column"
          mb={3}
          onClick={linkTo('Icons', name)}
        >
          <Icon height={32} width={32} />
          <Text color="gray" fontSize="xs" mt={2}>
            {name}
          </Text>
        </Flex>
      )
    })}
  </Box>
))
