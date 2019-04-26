const parseSeed = seed => {
  if (typeof seed === 'string') {
    return (
      seed
        // Convert to lowercase.
        .toLowerCase()
        // Replace commas with spaces.
        .replace(/[,]/g, ' ')
        // Replace everything except for lowercase letters and spaces.
        .replace(/[^a-z\s]/g, '')
        // Replace multiple spaces with a single space.
        .replace(/\s+/g, ' ')
        // Trim any leading and reailing spaces.
        .trim()
        // Split into individual words.
        .split(' ')
    )
  }
  return []
}

export default parseSeed
