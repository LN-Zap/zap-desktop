import snapshotDiff from 'snapshot-diff'

const snapDiff = (a, b, options) => {
  return snapshotDiff(a, b, { ...{ expand: true }, ...options })
}

export default snapDiff
