import { platform } from 'os'

/**
 * Get the OS specific lnd binary name.
 * @return {String} 'lnd' on mac or linux, 'lnd.exe' on windows.
 */
const lndBinaryName = platform() === 'win32' ? 'lnd.exe' : 'lnd'

export default lndBinaryName
