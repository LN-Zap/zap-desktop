export default function(channels, pendingchannels) {
  return Promise.all([channels, pendingchannels])
}