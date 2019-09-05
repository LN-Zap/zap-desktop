import { useState, useCallback } from 'react'
import useWindowDimensions from './useWindowDimensions'

/**
 * useMaxScreenHeight - Calculates max possible element height that
 * keeps element inside screen bounds.
 *
 * @param {number} defaultHeight default height
 * @returns {Array<Object, number>} ref to be used in the target component and max possible
 * element height that keeps  element inside screen bounds.
 */
export default function useMaxScreenHeight(defaultHeight) {
  const { height: screenHeight } = useWindowDimensions()
  const [maxHeight, setMaxHeight] = useState(defaultHeight)

  const ref = useCallback(
    node => {
      if (node !== null) {
        const { height, y } = node.getBoundingClientRect()
        const maxHeight = Math.min(height, screenHeight - y)
        setMaxHeight(maxHeight)
      }
    },
    [screenHeight]
  )

  return [ref, maxHeight]
}
