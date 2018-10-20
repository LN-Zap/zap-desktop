import React from 'react'
import { storiesOf } from '@storybook/react'
import { Box, Flex } from 'rebass'

import BigArrowLeft from 'components/Icon/BigArrowLeft'
import BigArrowRight from 'components/Icon/BigArrowRight'
import Bitcoin from 'components/Icon/Bitcoin'
import Btcpay from 'components/Icon/Btcpay'
import ChainLink from 'components/Icon/ChainLink'
import Channels from 'components/Icon/Channels'
import Check from 'components/Icon/Check'
import CheckAnimated from 'components/Icon/CheckAnimated'
import CheckCircle from 'components/Icon/CheckCircle'
import Clock from 'components/Icon/Clock'
import Cloudbolt from 'components/Icon/Cloudbolt'
import CloudLightning from 'components/Icon/CloudLightning'
import Contacts from 'components/Icon/Contacts'
import Copy from 'components/Icon/Copy'
import Error from 'components/Icon/Error'
import Eye from 'components/Icon/Eye'
import Globe from 'components/Icon/Globe'
import Hand from 'components/Icon/Hand'
import Help from 'components/Icon/Help'
import Help2 from 'components/Icon/Help2'
import IconPlus from 'components/Icon/IconPlus'
import Lightning from 'components/Icon/Lightning'
import Litecoin from 'components/Icon/Litecoin'
import LndLogo from 'components/Icon/LndLogo'
import LtcLogo from 'components/Icon/LtcLogo'
import Network from 'components/Icon/Network'
import Onchain from 'components/Icon/Onchain'
import PaperPlane from 'components/Icon/PaperPlane'
import Peers from 'components/Icon/Peers'
import Plus from 'components/Icon/Plus'
import PlusCircle from 'components/Icon/PlusCircle'
import Qrcode from 'components/Icon/Qrcode'
import Search from 'components/Icon/Search'
import Settings from 'components/Icon/Settings'
import SkinnyBitcoin from 'components/Icon/SkinnyBitcoin'
import Spinner from 'components/Icon/Spinner'
import Success from 'components/Icon/Success'
import SystemArrowLeft from 'components/Icon/SystemArrowLeft'
import SystemArrowRight from 'components/Icon/SystemArrowRight'
import SystemNavNext from 'components/Icon/SystemNavNext'
import SystemNavPrevious from 'components/Icon/SystemNavPrevious'
import User from 'components/Icon/User'
import Wallet from 'components/Icon/Wallet'
import Wallet2 from 'components/Icon/Wallet2'
import Warning from 'components/Icon/Warning'
import X from 'components/Icon/X'
import Zap from 'components/Icon/Zap'
import ZapLogo from 'components/Icon/ZapLogo'
import ZapLogoBlack from 'components/Icon/ZapLogoBlack'

const iconSizes = [16, 32, 64, 128]

const zapIconsList = {
  BigArrowLeft,
  BigArrowRight,
  Bitcoin,
  Btcpay,
  ChainLink,
  Channels,
  Check,
  CheckAnimated,
  CheckCircle,
  Clock,
  Cloudbolt,
  CloudLightning,
  Contacts,
  Copy,
  Error,
  Eye,
  Globe,
  Hand,
  Help,
  Help2,
  IconPlus,
  Lightning,
  Litecoin,
  LndLogo,
  LtcLogo,
  Network,
  Onchain,
  PaperPlane,
  Peers,
  Plus,
  PlusCircle,
  Qrcode,
  Search,
  Settings,
  SkinnyBitcoin,
  Spinner,
  Success,
  SystemArrowLeft,
  SystemArrowRight,
  SystemNavNext,
  SystemNavPrevious,
  User,
  Wallet,
  Wallet2,
  Warning,
  X,
  Zap,
  ZapLogo,
  ZapLogoBlack
}

const zapIconStories = storiesOf('Components.Icon', module)

Object.keys(zapIconsList).forEach(name => {
  var Icon = zapIconsList[name]
  zapIconStories.add(name, () => (
    <React.Fragment>
      {iconSizes.map(size => (
        <Flex key={`${name}-${size}`} alignItems="center" mb={3}>
          <Box mr={2}>
            {size} x {size}:
          </Box>
          <Icon width={size} height={size} />
        </Flex>
      ))}
    </React.Fragment>
  ))
})
