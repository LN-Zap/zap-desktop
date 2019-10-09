// Adapted from https://github.com/rehooks/component-size

import { useCallback, useState, useLayoutEffect } from 'react'

/**
 * getSize - Get the size of an element.
 *
 * @param {object} el Element to measure
 * @returns {object} Element size
 */
function getSize(el) {
  if (!el) {
    return {
      width: 0,
      height: 0,
      left: 0,
      top: 0,
      clientHeight: 0,
      scrollHeight: 0,
      scrollableHeight: 0,
      scrollableWidth: 0,
      isScrollbarVisible: false,
    }
  }

  return {
    width: el.offsetWidth,
    height: el.offsetHeight,
    left: el.offsetLeft,
    top: el.offsetTop,
    clientHeight: el.clientHeight,
    scrollHeight: el.scrollHeight,
    scrollableHeight: el.scrollHeight - el.clientHeight,
    scrollableWidth: el.scrollWidth - el.clientWidth,
    isScrollbarVisible: el.clientHeight < el.scrollHeight,
  }
}

/**
 * useComponentSize - React hook for determining the size of a component.
 *
 * @param {object} ref Component reference
 * @returns {object} Component size
 */
function useComponentSize(ref) {
  const [ComponentSize, setComponentSize] = useState(getSize(ref ? ref.current : {}))

  const handleResize = useCallback(
    function handleResize() {
      if (ref.current) {
        setComponentSize(getSize(ref.current))
      }
    },
    [ref]
  )

  useLayoutEffect(() => {
    if (!ref.current) {
      return
    }

    handleResize()

    const node = ref.current

    if (typeof ResizeObserver === 'function') {
      let resizeObserver = new ResizeObserver(() => handleResize())
      resizeObserver.observe(node)

      return () => {
        resizeObserver.disconnect(node)
        resizeObserver = null
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [handleResize, ref])

  return ComponentSize
}

export default useComponentSize
