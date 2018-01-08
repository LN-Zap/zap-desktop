import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './Donut.scss'

const Donut = ({ value, size, strokewidth }) => {
  console.log('value: ', value)
  console.log('size: ', size)
  console.log('strokewidth: ', strokewidth)

  const halfsize = (size * 0.5)
  const radius = halfsize - (strokewidth * 0.5)
  const circumference = 2 * Math.PI * radius
  const strokeval = ((value * circumference) / 100)
  const dashval = (`${strokeval} ${circumference}`)

  const trackstyle = { strokeWidth: 5 }
  const indicatorstyle = { strokeWidth: strokewidth, strokeDasharray: dashval }
  const rotateval = `rotate(-90 ${37.5},${37.5})`

  return (
    <svg width={75} height={75} className={styles.donutchart}>
      <circle r={30} cx={37.5} cy={37.5} transform={rotateval} style={trackstyle} className={styles.donutchartTrack} />
      <circle r={30} cx={37.5} cy={37.5} transform={rotateval} style={indicatorstyle} className={styles.donutchartIndicator} />
    </svg>
  )
}

Donut.propTypes = {
}

export default Donut
