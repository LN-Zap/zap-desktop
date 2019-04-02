import { useEffect, useRef } from 'react'

/**
 * Allows to add drag scroll behavior to react components
 * @param {boolean} isReversed scroll direction
 * @returns {Array} [scroller, onMouseDown, wrappedOnClick]
 * scroller - ref to a scroller object that needs to be used as ref in desired scrollable node
 * wrappedOnClick -  wrapper function that must be applied to onClick handlers
 */

const useScrollDrag = isReversed => {
  // parent scroller ref
  const scroller = useRef()

  // current scrolling offsets
  const scrollDeltaX = useRef()
  const scrollDeltaY = useRef()

  const isScrolling = useRef()

  //parent global scroll position
  const scrollLeft = useRef()
  const scrollTop = useRef()

  //original click coordinates
  const originX = useRef()
  const originY = useRef()

  const onScroll = (clientX, clientY) => {
    if (!isScrolling.current) {
      return
    }
    const DIRECTION_MULTIPLIER = isReversed ? -1 : 1
    // calculate scroll offset and update DOM scroll position
    scroller.current.scrollLeft =
      scrollLeft.current + DIRECTION_MULTIPLIER * (originX.current - clientX)
    scroller.current.scrollTop =
      scrollTop.current + (DIRECTION_MULTIPLIER * originY.current - clientY)

    // remember current scroll offset
    scrollDeltaX.current = originX.current - clientX
    scrollDeltaY.current = originY.current - clientY
  }

  const onStartScroll = (clientX, clientY) => {
    scrollDeltaX.current = 0
    scrollDeltaY.current = 0
    isScrolling.current = true
    scrollLeft.current = scroller.current.scrollLeft
    scrollTop.current = scroller.current.scrollTop
    originX.current = clientX
    originY.current = clientY
  }

  const onEndScroll = () => {
    isScrolling.current = false
  }

  const onMouseMove = event => {
    onScroll(event.clientX, event.clientY)
  }

  const onMouseDown = event => {
    onStartScroll(event.clientX, event.clientY)
  }

  // checks if scroll was released far enough from origin to dismiss
  // (used to determine whether this was onClick or scroll)
  const isScrollRelease = () =>
    Math.abs(scrollDeltaX.current) > 10 || Math.abs(scrollDeltaY.current) > 10

  // wrapper for onClick handlers that checks whether particular mouse up + down combination
  // was scroll or onClick
  const wrappedOnClick = fn => {
    return (...args) => {
      // this was a scroll release. Don't trigger onClick
      if (isScrollRelease()) {
        return
      }
      fn(...args)
    }
  }

  const onMouseUp = () => {
    onEndScroll()
  }

  // Touch events
  const onTouchStart = e => {
    const [event] = e.targetTouches
    onStartScroll(event.clientX, event.clientY)
  }

  const onTouchMove = e => {
    const [event] = e.targetTouches
    onScroll(event.clientX, event.clientY)
  }

  const onTouchCancel = () => {
    onEndScroll()
  }
  const onTouchEnd = () => {
    onEndScroll()
  }

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove, false)
    window.addEventListener('mouseup', onMouseUp, false)
    scroller.current && scroller.current.addEventListener('mousedown', onMouseDown, false)

    scroller.current && scroller.current.addEventListener('touchstart', onTouchStart, false)
    window.addEventListener('touchmove', onTouchMove, false)
    window.addEventListener('touchcancel', onTouchCancel, false)
    window.addEventListener('touchend', onTouchEnd, false)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      scroller.current && scroller.current.removeEventListener('mousedown', onMouseDown)

      scroller.current && scroller.current.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchcancel', onTouchCancel)
      window.removeEventListener('touchend', onTouchEnd)
    }
  })

  return [scroller, wrappedOnClick]
}

export default useScrollDrag
