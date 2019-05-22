import { platform } from 'os'

/**
 * lndBinaryName - Get the OS specific lnd binary name.
 *
 * @returns {string} 'lnd' on mac or linux, 'lnd.exe' on windows.
 */
const lndBinaryName = () => (platform() === 'win32' ? 'lnd.exe' : 'lnd')

export default lndBinaryName
