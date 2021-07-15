import React from 'react'

import { storiesOf } from '@storybook/react'
import { Box, Flex } from 'rebass/styled-components'

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
import BadgeAppStore from 'components/Icon/BadgeAppStore'
import BadgeGooglePlay from 'components/Icon/BadgeGooglePlay'
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
import Filter from 'components/Icon/Filter'
import FolderOpen from 'components/Icon/FolderOpen'
import Github from 'components/Icon/Github'
import GoogleDrive from 'components/Icon/GoogleDrive'
import ImportOnboarding from 'components/Icon/ImportOnboarding'
import LayoutCards from 'components/Icon/LayoutCards'
import LayoutList from 'components/Icon/LayoutList'
import Lightning from 'components/Icon/Lightning'
import LightningBolt from 'components/Icon/LightningBolt'
import LightningChannel from 'components/Icon/LightningChannel'
import LockSafe from 'components/Icon/LockSafe'
import Logout from 'components/Icon/Logout'
import Medium from 'components/Icon/Medium'
import MinusCircle from 'components/Icon/MinusCircle'
import Onchain from 'components/Icon/Onchain'
import OpenSource from 'components/Icon/OpenSource'
import Padlock from 'components/Icon/Padlock'
import Peace from 'components/Icon/Peace'
import Plus from 'components/Icon/Plus'
import PlusCircle from 'components/Icon/PlusCircle'
import PlusOnboarding from 'components/Icon/PlusOnboarding'
import Qrcode from 'components/Icon/Qrcode'
import Receive from 'components/Icon/Receive'
import Refresh from 'components/Icon/Refresh'
import Search from 'components/Icon/Search'
import Send from 'components/Icon/Send'
import Settings from 'components/Icon/Settings'
import Slack from 'components/Icon/Slack'
import Spinner from 'components/Icon/Spinner'
import Success from 'components/Icon/Success'
import Twitter from 'components/Icon/Twitter'
import User from 'components/Icon/User'
import UserCircle from 'components/Icon/UserCircle'
import Warning from 'components/Icon/Warning'
import X from 'components/Icon/X'
import Zap from 'components/Icon/Zap'
import ZapLogo from 'components/Icon/ZapLogo'
import ZapLogoFull from 'components/Icon/ZapLogoFull'
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
  BadgeAppStore,
  BadgeGooglePlay,
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
  Filter,
  FolderOpen,
  Github,
  GoogleDrive,
  ImportOnboarding,
  LayoutCards,
  LayoutList,
  Lightning,
  LightningBolt,
  LightningChannel,
  LockSafe,
  Logout,
  Medium,
  MinusCircle,
  Onchain,
  OpenSource,
  Padlock,
  Peace,
  Plus,
  PlusCircle,
  PlusOnboarding,
  Qrcode,
  Receive,
  Refresh,
  Search,
  Send,
  Settings,
  Slack,
  Spinner,
  Success,
  Twitter,
  User,
  UserCircle,
  Warning,
  X,
  Zap,
  ZapLogo,
  ZapLogoFull,
  ZapSolid,
}
const zapIconStories = storiesOf('Icons', module)
Object.keys(zapIconsList).forEach(name => {
  const Icon = zapIconsList[name]
  zapIconStories.add(name, () => (
    <>
      {iconSizes.map(size => (
        <Flex alignItems="center" key={`${name}-${size}`} mb={3}>
          <Box mr={2}>
            {size} x{size}:
          </Box>
          <Icon height={size} width={size} />
        </Flex>
      ))}
    </>
  ))
})
