const truncateNodePubkey = pubkey => (pubkey ? pubkey.substring(0, 10) : '')

export default truncateNodePubkey
