import React from 'react'

import PropTypes from 'prop-types'
import styled from 'styled-components'

import Tab from './Tab'

const Container = styled.div`
  display: ${props => (props.isActive ? 'display' : 'none')};
`

const PersistentTabControl = ({ activeTab, children, className }) => (
  <>
    {React.Children.map(children, (tab, index) => {
      const isActive = index === activeTab
      return (
        <Container className={className} isActive={isActive} key={index}>
          <Tab isActive={isActive}>{tab}</Tab>
        </Container>
      )
    })}
  </>
)

PersistentTabControl.propTypes = {
  activeTab: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}
export default PersistentTabControl
