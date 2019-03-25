import fs from 'fs'
import { promisify } from 'util'
import untildify from 'untildify'

const fsReadFile = promisify(fs.readFile)

export const fileExists = async path => fsReadFile(untildify(path))
