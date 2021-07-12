/* eslint-disable no-restricted-globals */

import { expose } from 'comlink'
import Long from 'long'
import * as Protobuf from 'protobufjs'

import ZapGrpc from '@zap/services/grpc/grpc'

// Protobuf assumes that long.js is either available on the global scope or available to be required. However, when
// used from the context of one of our web workers neither of these assumptions is true. In order to ensure that Long
// support is available in protobuf we manually configure protobuf here, before it is used.
//
// See https://github.com/protobufjs/protobuf.js#browserify-integration
//
// This ensures that large numbers (such as those returned from chanId props) can be properly handled without rounding.
Protobuf.util.Long = Long
Protobuf.configure()

expose(ZapGrpc, self)
