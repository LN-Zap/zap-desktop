/* eslint-disable no-restricted-globals */

import { expose } from 'comlink'

import Neutrino from '@zap/services/neutrino'

expose(Neutrino, self)
