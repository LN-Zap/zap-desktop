// Adapted from https://github.com/streamich/react-use/blob/master/docs/useScroll.md

import { useLayoutEffect, useRef, useState } from 'react'

const useScroll = ref => {
  const frame = useRef(0)
  const [state, setState] = useState(null)

  useLayoutEffect(() => {
    const node = ref.current

    const handler = () => {
      cancelAnimationFrame(frame.current)

      frame.current = requestAnimationFrame(() => {
        if (node) {
          setState({
            x: node.scrollLeft,
            y: node.scrollTop,
          })
        }
      })
    }

    if (node) {
      node.addEventListener('scroll', handler, {
        capture: false,
        passive: true,
      })
    }

    return () => {
      if (frame.current) {
        cancelAnimationFrame(frame.current)
      }

      if (node) {
        node.removeEventListener('scroll', handler)
      }
    }
  }, [ref, setState])

  return state
}

export default useScroll
